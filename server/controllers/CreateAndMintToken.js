import Sdk, { CHAIN_CONFIG } from "@unique-nft/sdk";
import { KeyringProvider } from "@unique-nft/accounts/keyring";
import CollectionModel from "../models/CollectionModel.js";
import TokenModel from "../models/TokenModel.js";
import UserModel from "../models/UserModel.js";

// Controller to create a new collection and mint its first token
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

  try {
    // Find the user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find an account from the provided mnemonic
    const account = await KeyringProvider.fromMnemonic(mnemonic);
    const address = account.address;

    // Initialize the SDK
    const sdk = new Sdk({
      baseUrl: CHAIN_CONFIG.opal.restUrl,
      signer: account,
    });

    // Create a new collection
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

    // Create the first token in the collection
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
        // attributes: {

        // }
      },
    });

    const tokenId = tokenResult.parsed?.tokenId;

    // Create a new token document in the database
    const createToken = await TokenModel.create({
      tokenName,
      tokenId,
      tokenOwnerAddress: address,
      tokenOwnerId: user._id,
      tokenDescription,
      tokenUrl: `https://uniquescan.io/opal/tokens/${collectionId}/${tokenId}`,
    });

    // Create a new collection document in the database
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

// Controller to mint a new token in an existing collection
export const mintToken = async (req, res) => {
  const { collectionId, mnemonic, tokenName, tokenDescription } = req.body;
  const userId = req.user.id;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Find an account from the provided mnemonic
    const account = await KeyringProvider.fromMnemonic(mnemonic);
    const address = account.address;

    // Initialize the SDK
    const sdk = new Sdk({
      baseUrl: CHAIN_CONFIG.opal.restUrl,
      signer: account,
    });

    // Mint a new token
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

    // Find the collection and add the new token
    const findCollection = await CollectionModel.findOne({ collectionId });
    const isWinningToken = Math.random() < 0.1;
    console.log(isWinningToken);

    if (findCollection) {
      const mintToken = await TokenModel.create({
        tokenName,
        tokenId,
        tokenOwnerAddress: address,
        tokenOwnerId: user._id,
        tokenDescription,
        tokenUrl: `https://uniquescan.io/opal/tokens/${collectionId}/${tokenId}`,
        isWinningToken,
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

// Controller to get all collections owned by a user
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

export const getUserTokensAndPrizes = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await UserModel.findById(userId)
      .populate("collectedTokens")
      .populate("wonPrizes");
    res.status(200).json({
      success: true,
      collectedTokens: user.collectedTokens,
      wonPrizes: user.wonPrizes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
