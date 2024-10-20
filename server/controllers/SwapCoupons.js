import { KeyringProvider } from "@unique-nft/accounts/keyring";
import Sdk, { CHAIN_CONFIG } from "@unique-nft/sdk";
import TokenModel from "../models/TokenModel.js";
import UserModel from "../models/UserModel.js";
import SwapOfferModel from "../models/SwapOfferModel.js";

export const initiateCouponSwap = async (req, res) => {
  const {
    ownTokenId,
    ownCollectionId,
    desiredTokenId,
    desiredCollectionId,
    recipientAddress,
  } = req.body;
  const userId = req.user.id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const ownToken = await TokenModel.findOne({
      tokenId: ownTokenId,
      collectionId: ownCollectionId,
      tokenOwnerId: userId,
    });
    if (!ownToken) {
      return res
        .status(404)
        .json({ success: false, message: "You don't own this token" });
    }

    const desiredToken = await TokenModel.findOne({
      tokenId: desiredTokenId,
      collectionId: desiredCollectionId,
      tokenOwnerAddress: recipientAddress,
    });
    if (!desiredToken) {
      return res.status(404).json({
        success: false,
        message:
          "Desired token not found or not owned by the specified address",
      });
    }

    // Create a swap offer in the database
    const swapOffer = new SwapOfferModel({
      initiator: userId,
      recipient: desiredToken.tokenOwnerId,
      ownTokenId,
      ownCollectionId,
      desiredTokenId,
      desiredCollectionId,
      status: "pending",
    });
    await swapOffer.save();

    res.status(200).json({
      success: true,
      message: "Swap offer initiated",
      swapOfferId: swapOffer._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const acceptCouponSwap = async (req, res) => {
  const { swapOfferId } = req.body;
  const userId = req.user.id;

  try {
    const swapOffer = await SwapOfferModel.findById(swapOfferId);
    if (!swapOffer || swapOffer.recipient.toString() !== userId) {
      return res.status(404).json({
        success: false,
        message: "Swap offer not found or not intended for you",
      });
    }

    const initiator = await UserModel.findById(swapOffer.initiator);
    const recipient = await UserModel.findById(swapOffer.recipient);

    if (!initiator || !recipient) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const initiatorAccount = await KeyringProvider.fromMnemonic(
      initiator.mnemonic
    );
    const recipientAccount = await KeyringProvider.fromMnemonic(
      recipient.mnemonic
    );
    const initiatorAddress = initiatorAccount.address;
    const recipientAddress = recipientAccount.address;

    const initiatorSdk = new Sdk({
      baseUrl: CHAIN_CONFIG.opal.restUrl,
      signer: initiatorAccount,
    });

    // Perform the token transfer for the initiator
    const txTransferInitiator =
      await initiatorSdk.token.transfer.submitWaitResult({
        collectionId: swapOffer.ownCollectionId,
        tokenId: swapOffer.ownTokenId,
        address: initiatorAddress,
        to: recipientAddress,
      });

    const parsedTransferInitiator = txTransferInitiator.parsed;
    const transferCompletedInitiator = txTransferInitiator.isCompleted;
    console.log(`Transfer completed: ${transferCompletedInitiator}`);

    if (!transferCompletedInitiator) {
      return res.status(400).json({
        success: false,
        message: "Failed to transfer token.",
      });
    }

    // Wait for 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10000));

    const recipientSdk = new Sdk({
      baseUrl: CHAIN_CONFIG.opal.restUrl,
      signer: recipientAccount,
    });

    // Perform the token transfer for the recipient
    const txTransferRecipient =
      await recipientSdk.token.transfer.submitWaitResult({
        collectionId: swapOffer.desiredCollectionId,
        tokenId: swapOffer.desiredTokenId,
        address: recipientAddress,
        to: initiatorAddress,
      });

    const parsedTransferRecipient = txTransferRecipient.parsed;
    const transferCompletedRecipient = txTransferRecipient.isCompleted;
    console.log(`Transfer completed: ${transferCompletedRecipient}`);

    if (!transferCompletedRecipient) {
      return res.status(400).json({
        success: false,
        message: "Failed to transfer token.",
      });
    }

    // Update token ownership in the database
    await TokenModel.findOneAndUpdate(
      {
        tokenId: swapOffer.ownTokenId,
        collectionId: swapOffer.ownCollectionId,
      },
      {
        tokenOwnerAddress: recipient.accountAddress,
        tokenOwnerId: recipient._id,
      }
    );
    await TokenModel.findOneAndUpdate(
      {
        tokenId: swapOffer.desiredTokenId,
        collectionId: swapOffer.desiredCollectionId,
      },
      {
        tokenOwnerAddress: initiator.accountAddress,
        tokenOwnerId: initiator._id,
      }
    );

    // Update swap offer status
    swapOffer.status = "completed";
    await swapOffer.save();

    res.status(200).json({
      success: true,
      message: "Swap completed successfully",
      tokenId: parsedTransferInitiator?.tokenId,
      collectionId: parsedTransferInitiator?.collectionId,
      tokenIdRecipient: parsedTransferRecipient?.tokenId,
      collectionIdRecipient: parsedTransferRecipient?.collectionId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

// TODO: Implement the cancelCouponSwap controller
export const declineCouponSwap = async (req, res) => {
  const { swapOfferId } = req.body;
  const userId = req.user.id;

  try {
    const swapOffer = await SwapOfferModel.findById(swapOfferId);
    if (!swapOffer) {
      return res
        .status(404)
        .json({ success: false, message: "Swap offer not found" });
    }

    // is user the recipient of the swap offer
    if (swapOffer.recipient.toString() !== userId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You are not authorized to decline this offer",
        });
    }

    // update swap offer status to declined?
    swapOffer.status = "declined";
    await swapOffer.save();

    res.status(200).json({
      success: true,
      message: "Swap offer declined successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
