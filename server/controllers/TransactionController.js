import TransactionModel from "../models/TransactionModel.js";
import ItemModel from "../models/ItemsModel.js";
import UserModel from "../models/UserModel.js";
import Sdk, { CHAIN_CONFIG } from "@unique-nft/sdk";
import { KeyringProvider } from "@unique-nft/accounts/keyring";
import TokenModel from "../models/TokenModel.js";

export const checkBuyerPurchases = async (req, res) => {
  const userId = req.user.id;
  try {
    const purchases = await TransactionModel.find({ buyerId: userId });
    if (purchases.length <= 0) {
      return res.status(200).json({
        success: true,
        message: "No Purchases for this user",
      });
    }
    res.status(200).json({
      success: true,
      purchases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const checkStorePurchases = async (req, res) => {
  const itemOwnerId = req.user.id;

  try {
    const item = await ItemModel.find({ itemOwnerId });
    if (!item) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    // Find all transactions where the itemOwner matches the store owner's ID
    const storePurchases = await TransactionModel.find({
      storeOwnerId: itemOwnerId,
    }).select("buyerId buyerName itemName quantity totalPrice createdAt");

    if (storePurchases.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No purchases have been made from your store yet.",
      });
    }

    // Calculate total sales and items
    const totalSales = storePurchases.reduce(
      (sum, purchase) => sum + purchase.totalPrice,
      0
    );
    const totalItems = storePurchases.reduce(
      (sum, purchase) => sum + purchase.quantity,
      0
    );

    const highestBuyer = storePurchases.reduce((prev, current) => {
      return prev.totalPrice > current.totalPrice ? prev : current;
    });

    res.status(200).json({
      success: true,
      purchases: storePurchases,
      totalSales,
      totalItems,
      totalTransactions: storePurchases.length,
      highestBuyer: {
        buyerId: highestBuyer.buyerId,
        buyerName: highestBuyer.buyerName,
        totalPurchase: highestBuyer.totalPrice,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const purchaseCoupon = async (req, res) => {
  const { tokenId, collectionId, quantity } = req.body;
  const buyerId = req.user.id;

  if (!tokenId || !collectionId || !quantity) {
    return res.status(400).json({
      success: false,
      error:
        "Missing required fields: tokenId, collectionId and quantity must be provided",
    });
  }

  try {
    const buyer = await UserModel.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({
        success: false,
        error: "Buyer not found",
      });
    }

    if (!buyer.mnemonic) {
      return res.status(400).json({
        success: false,
        error: "Buyer's mnemonic not found",
      });
    }

    const token = await TokenModel.findOne({ tokenId, collectionId });
    if (!token) {
      return res.status(404).json({ success: false, error: "Token not found" });
    }

    // Check if requested quantity is available
    if (token.quantityAvailable < quantity) {
      return res.status(400).json({
        success: false,
        error: "Requested quantity not available",
      });
    }

    const seller = await UserModel.findOne({
      accountAddress: token.tokenOwnerAddress,
    });
    if (!seller) {
      return res
        .status(404)
        .json({ success: false, error: "Seller not found" });
    }

    const buyerAccount = await KeyringProvider.fromMnemonic(buyer.mnemonic);
    const sellerAccount = await KeyringProvider.fromMnemonic(seller.mnemonic);

    const buyerAddress = buyerAccount.address;
    const sellerAddress = sellerAccount.address;

    const sdk = new Sdk({
      baseUrl: CHAIN_CONFIG.opal.restUrl,
      signer: buyerAccount,
    });

    const sellerSdk = new Sdk({
      baseUrl: CHAIN_CONFIG.opal.restUrl,
      signer: sellerAccount,
    });

    const totalPrice = token.priceOfCoupon * quantity;

    // Check if buyer's wallet has enough balance
    const buyerBalance = await sdk.balance.get({
      address: buyer.accountAddress,
    });
    if (buyerBalance.availableBalance.amount < totalPrice) {
      return res.status(400).json({
        success: false,
        error: "Insufficient balance",
      });
    }

    // Transfer payment from buyer to seller
    await sdk.balance.transfer.submitWaitResult(
      {
        address: buyerAddress,
        destination: seller.accountAddress,
        amount: totalPrice,
      },
      { signer: buyerAccount }
    );

    // Transfer token from seller to buyer
    const txTransfer = await sellerSdk.token.transfer.submitWaitResult({
      collectionId,
      tokenId,
      address: sellerAddress,
      to: buyer.accountAddress,
    });

    const parsedTransfer = txTransfer.parsed;
    const transferCompleted = txTransfer.isCompleted;
    console.log(`Transfer completed: ${transferCompleted}`);

    if (!transferCompleted) {
      return res.status(400).json({
        success: false,
        message: "Failed to transfer token.",
      });
    }

    // Update token ownership and quantity in the database
    await TokenModel.findOneAndUpdate(
      { tokenId, collectionId },
      {
        tokenOwnerAddress: buyer.accountAddress,
        tokenOwnerId: buyer._id,
        isPurchased: true,
        $inc: { quantityAvailable: -quantity },
      }
    );

    // Update seller's wallet balance
    await UserModel.findByIdAndUpdate(
      seller._id,
      { $inc: { walletBalance: totalPrice } },
      { new: true }
    );

    // Create transaction record
    const transaction = new TransactionModel({
      buyerId: buyer._id,
      buyerName: buyer.username || buyer.email,
      item: token._id,
      itemOwner: seller.username || seller.email,
      storeOwnerId: seller._id,
      itemName: token.tokenName,
      quantity: quantity,
      totalPrice: totalPrice,
    });

    await transaction.save();

    // If it's a winning token, add it to buyer's collected tokens
    if (token.isWinningToken) {
      await UserModel.findByIdAndUpdate(
        buyer._id,
        { $addToSet: { collectedTokens: token._id } },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      message: "Token purchased and transferred successfully",
      transaction,
      tokenId: parsedTransfer?.tokenId,
      collectionId: parsedTransfer?.collectionId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message ? error.message : error,
    });
  }
};

export const purchaseItem = async (req, res) => {
  const { itemId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    const item = await ItemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }

    const totalPrice = item.priceOfItem * quantity;

    const transaction = new TransactionModel({
      buyerId: userId,
      buyerName: user.username || user.email,
      item: itemId,
      itemOwner: item.itemOwner,
      storeOwnerId: item.itemOwnerId,
      itemName: item.nameOfItem,
      // store: item.itemOwnerId,
      quantity,
      totalPrice,
    });

    await transaction.save();

    // const userTransactions = await TransactionModel.find({ user: userId })
    // const totalItemsPurchased = userTransactions.reduce((total, t) => total + t.quantity, 0);

    // if (totalItemsPurchased >= 4) {
    //   try {
    //     const user = await UserModel.findById(userId);
    //     if (!user.hasReceivedToken) {

    //     }
    //   } catch (error) {

    //   }
    // }

    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
