import TransactionModel from "../models/TransactionModel.js";
import ItemModel from "../models/ItemsModel.js";
import UserModel from "../models/UserModel.js";
import Sdk, { CHAIN_CONFIG } from "@unique-nft/sdk";
import { KeyringProvider } from "@unique-nft/accounts/keyring";
import TokenModel from "../models/TokenModel.js";
import SpecialTokenModel from "../models/SpecialToken.js";
import { checkAndTransferSpecialToken } from "../services/SpecialTokenService.js";

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
    const storeOwner = await UserModel.findById(itemOwnerId);
    if (!storeOwner) {
      return res.status(404).json({
        success: false,
        error: "Store owner not found",
      });
    }
    const items = await TransactionModel.find({ storeOwnerId: storeOwner._id });
    if (!items) {
      return res.status(404).json({
        success: false,
        error: "No items found for this store owner",
      });
    }
    // Find all transactions where the itemOwner matches the store owner's ID
    const storePurchases = await TransactionModel.find({
      storeOwnerId: itemOwnerId,
    }).select("buyerId buyerName nameOfItemPurchased totalPrice purchaseDate");

    if (storePurchases.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No purchases have been made from your store yet.",
      });
    }

    // Return the store purchases
    return res.status(200).json({
      success: true,
      purchases: storePurchases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const purchaseCoupon = async (req, res) => {
  const { tokenId, collectionId } = req.body;
  const buyerId = req.user.id;

  if (!tokenId || !collectionId) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: tokenId, collectionId must be provided",
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

    // Check if buyer's wallet has enough balance
    const buyerBalance = await sdk.balance.get({
      address: buyer.accountAddress,
    });
    if (buyerBalance.availableBalance.amount < token.priceOfCoupon) {
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
        amount: token.priceOfCoupon,
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

    if (transferCompleted) {
      await TokenModel.findOneAndUpdate(
        { tokenId, collectionId },
        {
          tokenOwnerAddress: buyer.accountAddress,
          tokenOwnerId: buyer._id,
          isPurchased: true,
        }
      );

      // Update seller's wallet balance
      await UserModel.findByIdAndUpdate(
        seller._id,
        { $inc: { walletBalance: token.priceOfCoupon } },
        { new: true }
      );

      // Create transaction record
      const transaction = new TransactionModel({
        buyerId: buyer._id,
        buyerName: buyer.username || buyer.email,
        nameOfItemPurchased: token.tokenName,
        storeOwnerId: seller._id,
        totalPrice: token.priceOfCoupon,
      });

      await transaction.save();
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
  const { tokenId, collectionId } = req.body;
  const buyerId = req.user.id;

  if (!tokenId || !collectionId) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: tokenId, collectionId must be provided",
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

    const item = await TokenModel.findOne({
      tokenId,
      collectionId,
      isItem: true,
    });
    if (!item) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }

    const seller = await UserModel.findOne({
      accountAddress: item.tokenOwnerAddress,
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

    const buyerBalance = await sdk.balance.get({
      address: buyerAddress,
    });

    if (buyerBalance.availableBalance.amount < item.priceOfCoupon) {
      return res.status(400).json({
        success: false,
        error: "Insufficient balance",
      });
    }

    await sdk.balance.transfer.submitWaitResult(
      {
        address: buyerAddress,
        destination: seller.accountAddress,
        amount: item.priceOfCoupon,
      },
      { signer: buyerAccount }
    );

    const txTransfer = await sellerSdk.token.transfer.submitWaitResult({
      collectionId,
      tokenId,
      address: sellerAddress,
      to: buyer.accountAddress,
    });

    const parsedTransfer = txTransfer.parsed;
    const transferCompleted = txTransfer.isCompleted;
    console.log(`Transfer completed: ${transferCompleted}`);

    if (transferCompleted) {
      await TokenModel.findOneAndUpdate(
        { tokenId, collectionId, isItem: true },
        {
          tokenOwnerAddress: buyer.accountAddress,
          tokenOwnerId: buyer._id,
          isPurchased: true,
        }
      );

      await UserModel.findByIdAndUpdate(
        seller._id,
        { $inc: { walletBalance: item.priceOfCoupon } },
        { new: true }
      );

      const transaction = new TransactionModel({
        buyerId: buyer._id,
        buyerName: buyer.username || buyer.email,
        item: item._id,
        nameOfItemPurchased: item.tokenName,
        storeOwnerId: seller._id,
        totalPrice: item.priceOfCoupon,
      });

      await transaction.save();

      // Check and transfer special token
      const specialTokenTransferred = await checkAndTransferSpecialToken(
        buyer,
        seller,
        sellerSdk
      );

      if (specialTokenTransferred) {
        console.log("Special token transferred successfully");

        // Send a response indicating the special token transfer was successful
        return res.status(200).json({
          success: true,
          message: "Purchase successful and special token transferred",
          specialTokenTransferred: true, // indicate the special token transfer
        });
      }

      // when no special token was transferred, return normal success
      return res.status(200).json({
        success: true,
        message: "Purchase successful",
        specialTokenTransferred: false, // No special token transferred
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message ? error.message : error,
    });
  }
};
