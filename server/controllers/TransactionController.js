// Import required models and dependencies
import TransactionModel from "../models/TransactionModel.js";
import UserModel from "../models/UserModel.js";
import Sdk, { CHAIN_CONFIG } from "@unique-nft/sdk";
import { KeyringProvider } from "@unique-nft/accounts/keyring";
import TokenModel from "../models/TokenModel.js";
import { checkAndTransferSpecialToken } from "../services/SpecialTokenService.js";
import { applyCouponDiscount } from "../utils/UseCoupon.js";
// import AdminWalletModel from "../models/AdminWallet.js";

// Helper function to get active admin wallet (currently commented out)
// const getActiveAdminWallet = async () => {
//   const adminWallet = await AdminWalletModel.findOne({ isActive: true });
//   if (!adminWallet) {
//     throw new Error("No active admin wallet found");
//   }
//   return adminWallet.walletAddress;
// }

/**
 * Get all purchases made by a specific buyer
 * @param {Object} req - Request object containing user ID
 * @param {Object} res - Response object
 */
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

/**
 * Get all purchases made from a specific store/seller
 * @param {Object} req - Request object containing store owner ID
 * @param {Object} res - Response object
 */
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

/**
 * Handle the purchase of a coupon token
 * Includes token transfer and payment processing with VAT calculation
 * @param {Object} req - Request object containing tokenId and collectionId
 * @param {Object} res - Response object
 */
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
    // Validate buyer exists and has mnemonic
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

    // Validate token and seller exist
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

    // Initialize blockchain accounts and SDKs
    const buyerAccount = await KeyringProvider.fromMnemonic(buyer.mnemonic);
    const sellerAccount = await KeyringProvider.fromMnemonic(seller.mnemonic);

    const buyerAddress = buyerAccount.address;
    const sellerAddress = sellerAccount.address;


    const sdk = new Sdk({
      baseUrl: "https://rest.unique.network/opal/v1",
      signer: buyerAccount,
    });

    const sellerSdk = new Sdk({
      baseUrl: "https://rest.unique.network/opal/v1",
      signer: sellerAccount,
    });

    // Verify buyer has sufficient balance
    const buyerBalance = await sdk.balance.get({
      address: buyer.accountAddress,
    });
    if (buyerBalance.availableBalance.amount < token.finalPriceOfCoupon) {
      return res.status(400).json({
        success: false,
        error: "Insufficient balance",
      });
    }

    // Transfer token from seller to buyer
    const txTransfer = await sellerSdk.token.transfer.submitWaitResult({
      collectionId,
      tokenId,
      address: sellerAddress,
      to: buyer.accountAddress,
    });

    const parsedTransfer = txTransfer?.parsed;
    const transferCompleted = txTransfer?.isCompleted;
    console.log(`Transfer completed: ${transferCompleted}`);

    if (transferCompleted) {
      // Award points to buyer
      buyer.points += 10;
      await buyer.save();

      // Calculate VAT and seller amounts
      const vatAmount = Math.floor(token.priceOfCoupon * 0.05);
      const sellerAmount = token.finalPriceOfCoupon - vatAmount;

      try {
        // VAT transfer to admin wallet (currently commented out)
        // const adminWalletAddress = await getActiveAdminWallet();
        // await sdk.balance.transfer.submitWaitResult(
        //   {
        //     address: buyerAddress,
        //     destination: adminWalletAddress,
        //     amount: vatAmount,
        //   },
        //   { signer: buyerAccount }
        // );

        // Transfer payment to seller
        await sdk.balance.transfer.submitWaitResult(
          {
            address: buyerAddress,
            destination: seller.accountAddress,
            amount: sellerAmount,
          },
          { signer: buyerAccount }
        );

        // Update token ownership
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
          totalPrice: token.finalPriceOfCoupon,
          item: token._id,
        });
        await transaction.save();
      } catch (error) {
        throw new Error(`Failed to process payments: ${error.message}`);
      }
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

// Helper function to verify Ethereum transactions (currently commented out)
// const verifyEthTransaction = async (txHash, expectedAmount) => {
//   const web3 = new Web3(process.env.ETH_NODE_URL);
//   try {
//     const tx = await web3.eth.getTransaction(txHash);
//     const receipt = await web3.eth.getTransactionReceipt(txHash);

//     if (!receipt || !receipt.status) {
//       throw new Error("Transaction failed or pending");
//     }

//     const txAmount = web3.utils.fromWei(tx.value, "ether");
//     if (parseFloat(txAmount) !== parseFloat(expectedAmount)) {
//       throw new Error("Transaction amount mismatch");
//     }

//     return true;
//   } catch (error) {
//     console.error("ETH verification error:", error);
//     return false;
//   }
// };

/**
 * Handle the purchase of an item
 * Includes token transfer, coupon discount application, and payment processing
 * @param {Object} req - Request object containing purchase details
 * @param {Object} res - Response object
 */
export const purchaseItem = async (req, res) => {
  const {
    tokenId,
    collectionId,
    applyTokenId,
    applyCollectionId,
    tokenType,
    // ethAddress,
    // transactionHash,
  } = req.body;
  const buyerId = req.user.id;

  if (!tokenId || !collectionId) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: tokenId, collectionId must be provided",
    });
  }

  try {
    // Validate buyer exists and has mnemonic
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

    // Validate item and seller exist
    const item = await TokenModel.findOne({
      tokenId,
      collectionId,
      isItem: true,
    });
    console.log(tokenId, collectionId);
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

    // Calculate final price after applying any coupon discounts
    const { finalPrice, discountAmount } = await applyCouponDiscount(
      buyer,
      seller,
      item,
      applyTokenId,
      applyCollectionId,
      tokenType
    );

    const adminMnemonic = "cause thing movie now during gentle approve machine laptop whisper capital extra"
    // Initialize blockchain accounts and SDKs
    const buyerAccount = await KeyringProvider.fromMnemonic(buyer.mnemonic);
    const sellerAccount = await KeyringProvider.fromMnemonic(seller.mnemonic);
    const adminAccount = await KeyringProvider.fromMnemonic(adminMnemonic);

    const buyerAddress = buyerAccount.address;
    const sellerAddress = sellerAccount.address;
    const adminAddress = adminAccount.address;

    
    const sdk = new Sdk({
      baseUrl: "https://rest.unique.network/opal/v1",
      signer: buyerAccount,
    });

    const sellerSdk = new Sdk({
      baseUrl: "https://rest.unique.network/opal/v1",
      signer: sellerAccount,
    });

    // const adminSdk = new Sdk({
    //   baseUrl: "https://rest.unique.network/opal/v1",
    //   signer: adminAccount,
    // });

    // Verify buyer has sufficient balance
    const buyerBalance = await sdk.balance.get({
      address: buyerAddress,
    });

    if (buyerBalance.availableBalance.amount < finalPrice) {
      return res.status(400).json({
        success: false,
        error: "Insufficient balance",
      });
    }

    // Transfer item token from seller to buyer
    const txTransfer = await sellerSdk.token.transfer.submitWaitResult({
      collectionId,
      tokenId,
      address: sellerAddress,
      to: buyer.accountAddress,
    });

    const parsedTransfer = txTransfer?.parsed;
    const transferCompleted = txTransfer?.isCompleted;
    console.log(`Transfer completed: ${transferCompleted}`);

    if (transferCompleted) {
      // Award points to buyer
      buyer.points += 10;
      await buyer.save();

      // Update token ownership and status
      await TokenModel.findOneAndUpdate(
        { tokenId, collectionId },
        {
          tokenOwnerAddress: buyer.accountAddress,
          tokenOwnerId: buyer._id,
          isPurchased: true,
        }
      );

      // Calculate VAT and seller amounts
      const vatRate = 0.05;
      const vatAmount = Math.ceil(finalPrice * vatRate);
      const sellerAmount = finalPrice - vatAmount;

      try {
        // Transfer payment to seller
        await sdk.balance.transfer.submitWaitResult(
          {
            address: buyerAddress,
            destination: seller.accountAddress,
            amount: sellerAmount,
          },
          { signer: buyerAccount }
        );

        // Transfer VAT if amount is greater than 0
        if (vatAmount > 0) {
          await sdk.balance.transfer.submitWaitResult(
            {
              address: buyerAddress,
              destination: adminAddress,
              amount: vatAmount,
            },
            { signer: buyerAccount }
          );
        }

        // Update seller's wallet balance
        await UserModel.findByIdAndUpdate(
          seller._id,
          { $inc: { walletBalance: sellerAmount } },
          { new: true }
        );

        // Create transaction record
        const transaction = await TransactionModel.create({
          buyerId: buyer._id,
          buyerName: buyer.username || buyer.email,
          item: item._id,
          nameOfItemPurchased: item.tokenName,
          storeOwnerId: seller._id,
          totalPrice: finalPrice,
        });

        // Check and transfer any special tokens if applicable
        const specialTokenTransferred = await checkAndTransferSpecialToken(
          buyer,
          seller,
          sellerAddress,
          sellerAccount
        );

        if (specialTokenTransferred) {
          console.log("Special token transferred successfully");

          return res.status(200).json({
            success: true,
            message: "Purchase successful and special token transferred",
            specialTokenTransferred: true,
          });
        }

        res.status(201).json({
          success: true,
          message: "Item purchased successfully",
          transaction,
          discountApplied: discountAmount > 0,
          discountAmount,
          finalPrice,
          tokenId: parsedTransfer?.tokenId,
          collectionId: parsedTransfer?.collectionId,
        });
      } catch (error) {
        throw new Error(`Failed to process payments: ${error.message}`);
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message ? error.message : error,
    });
  }
};
