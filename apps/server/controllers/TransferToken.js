import Sdk, { CHAIN_CONFIG } from "@unique-nft/sdk";
import { KeyringProvider } from "@unique-nft/accounts/keyring";
import TokenModel from "../models/TokenModel.js";
import UserModel from "../models/UserModel.js";

export const transferTokenController = async (req, res) => {
  const { mnemonic, collectionId, tokenId, toAddress } = req.body;
  const userId = req.user.id;

  if (!mnemonic || !collectionId || !tokenId || !toAddress) {
    return res.status(400).json({
      success: false,
      message: "Mnemonic, collectionId, tokenId, and toAddress are required",
    });
  }

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const account = await KeyringProvider.fromMnemonic(mnemonic);
    const address = account.address;

    const sdk = new Sdk({
      baseUrl: CHAIN_CONFIG.opal.restUrl,
      signer: account,
    });

    const txTransfer = await sdk.token.transfer.submitWaitResult({
      collectionId,
      tokenId,
      address,
      to: toAddress,
    });

    const parsedTransfer = txTransfer.parsed;

    const token = await TokenModel.findOne({ tokenOwnerAddress: address });
    const findUser = await UserModel.findOne({ accountAddress: address });

    if (token.isWinningToken && findUser.collectedTokens.includes(token._id)) {
      await UserModel.findOneAndUpdate(
        { accountAddress: address },
        { $pull: { collectedTokens: token._id } },
        { new: true }
      );
      console.log("Winning token removed from sender");
    }

    const updatedToken = await TokenModel.findOneAndUpdate(
      { collectionId, tokenId },
      {
        tokenOwnerAddress: toAddress,
      }
    );

    if (updatedToken.isWinningToken) {
      await UserModel.findOneAndUpdate(
        { accountAddress: toAddress },
        { $addToSet: { collectedTokens: updatedToken._id } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Token transferred successfully",
      newOwner: parsedTransfer?.to,
      tokenId: parsedTransfer?.tokenId,
      collectionId: parsedTransfer?.collectionId,
      updatedToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while transferring the token",
      error: error.message,
    });
  }
};
