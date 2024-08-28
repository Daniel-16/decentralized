import Sdk, { CHAIN_CONFIG } from "@unique-nft/sdk";
import { KeyringProvider } from "@unique-nft/accounts/keyring";
import CollectionModel from "../models/CollectionModel.js";
import TokenModel from "../models/TokenModel.js";
import UserModel from "../models/UserModel.js";

export const createCollectionAndTokenController = async (req, res) => {
  const {
    mnemonic,
    tokenName,
    tokenDescription,
    tokenPrefix,
    collectionName,
    name,
    description,
  } = req.body;
  const userId = req.user.id;

  // if (
  //   !mnemonic ||
  //   !tokenPrefix ||
  //   !tokenName ||
  //   !tokenDescription ||
  //   !collectionName
  // ) {
  //   return res.status(400).json({
  //     message:
  //       "Mnemonic, tokenPrefix, tokenName, tokenDescription, collection name, and collection description are required",
  //   });
  // }

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const account = await KeyringProvider.fromMnemonic(mnemonic);
    const address = account.address;

    const sdk = new Sdk({
      baseUrl: CHAIN_CONFIG.opal.restUrl,
      signer: account,
    });

    const { parsed, error } = await sdk.collection.create.submitWaitResult({
      address,
      name,
      description,
      tokenPrefix,
    });

    if (error) {
      throw new Error(`Create collection error: ${error}`);
    }

    const collectionId = parsed?.collectionId;

    const tokenResult = await sdk.token.create.submitWaitResult({
      address,
      collectionId,
      data: {
        image: {
          ipfsCid: "QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png",
        },
        name: {
          _: tokenName,
        },
        description: {
          _: tokenDescription,
        },
      },
    });

    const tokenId = tokenResult.parsed?.tokenId;

    const createToken = await TokenModel.create({
      tokenName,
      tokenId,
      tokenOwnerAddress: address,
      tokenDescription,
      tokenUrl: `https://uniquescan.io/opal/tokens/${collectionId}/${tokenId}`,
    });

    const collectionPayload = await CollectionModel.create({
      collectionOwner: user._id,
      collectionId,
      tokenId,
      collectionUrl: `https://uniquescan.io/opal/collections/${collectionId}`,
      tokenUrl: `https://uniquescan.io/opal/tokens/${collectionId}/${tokenId}`,
      walletAddress: address,
      token: createToken._id,
    });

    res.status(200).json({
      success: true,
      message: "Collection and token created successfully",
      collectionPayload,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the collection and token",
      error: error,
    });
  }
};

export const mintToken = async (req, res) => {
  const { collectionId, mnemonic, tokenName, tokenDescription } = req.body;
  try {
    const account = await KeyringProvider.fromMnemonic(mnemonic);
    const address = account.address;

    const sdk = new Sdk({
      baseUrl: CHAIN_CONFIG.opal.restUrl,
      signer: account,
    });

    const result = await sdk.token.create.submitWaitResult({
      address,
      collectionId,
      data: {
        image: {
          ipfsCid: "QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png",
        },
        name: {
          _: tokenName,
        },
        description: {
          _: tokenDescription,
        },
      },
    });

    const tokenId = result.parsed?.tokenId;

    const findCollection = await CollectionModel.findOne({ collectionId });
    if (findCollection) {
      const mintToken = await TokenModel.create({
        tokenName,
        tokenId,
        tokenOwnerAddress: address,
        tokenDescription,
        tokenUrl: `https://uniquescan.io/opal/tokens/${collectionId}/${tokenId}`,
      });
      findCollection.token.push(mintToken._id);
      await findCollection.save();
      return res.status(200).json({
        success: true,
        message: "Token minted successfully",
        mintToken,
      });
    }
    res.status(404).json({
      success: false,
      message: "Collection not found",
    });
    // res.status(200).json({
    //   success: true,
    //   message: "Token created successfully",

    // });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

export const getUserCollections = async (req, res) => {
  const userId = req.user.id;
  try {
    const collections = await CollectionModel.find({ collectionOwner: userId });
    if (collections.length <= 0) {
      return res.status(200).json({
        success: true,
        message: "No collections created for this user",
      });
    }
    res.status(200).json({
      success: true,
      collections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
