import Sdk, { CHAIN_CONFIG } from "@unique-nft/sdk";
import { KeyringProvider } from "@unique-nft/accounts/keyring";
import CollectionModel from "../models/CollectionModel.js";
import TokenModel from "../models/TokenModel.js";
import UserModel from "../models/UserModel.js";
import SpecialTokenModel from "../models/SpecialToken.js";

// Controller to create a new collection
export const createCollectionController = async (req, res) => {
  const { tokenPrefix, name, description } = req.body;
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

    // Get the mnemonic from the user
    const mnemonic = user.mnemonic;
    if (!mnemonic) {
      return res.status(400).json({
        success: false,
        message: "User mnemonic not found",
      });
    }

    // Find an account from the user's mnemonic
    const account = await KeyringProvider.fromMnemonic(mnemonic);
    const address = account.address;

    // Initialize the SDK
    const sdk = new Sdk({
      baseUrl: CHAIN_CONFIG.opal.restUrl,
      signer: account,
    });

    // Create a new collection
    const { parsed, isCompleted } =
      await sdk.collection.create.submitWaitResult({
        address,
        name,
        description,
        tokenPrefix,
      });

    console.log(isCompleted);

    // if (error) {
    //   return res.status(500).json({
    //     success: false,
    //     message: "An error occurred while creating the collection",
    //     error: error,
    //   });
    // }

    if (!isCompleted) {
      return res.status(500).json({
        success: false,
        message: "Collection creation failed",
      });
    }

    const { collectionId } = parsed;

    const collection = await sdk.collection.get({ collectionId });

    // Create a new collection document in the database
    const collectionPayload = await CollectionModel.create({
      collectionOwner: user._id,
      collectionId,
      collectionUrl: `https://uniquescan.io/opal/collections/${collectionId}`,
      walletAddress: address,
      name,
      description
    });

    res.status(200).json({
      success: true,
      message: "Collection created successfully",
      collectionPayload,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the collection",
      error: error.message,
    });
  }
};

// Controller to mint a new token in an existing collection
export const mintToken = async (req, res) => {
  const {
    collectionId,
    tokenName,
    tokenDescription,
    tokenImageUrl,
    priceOfCoupon,
    quantityAvailable,
  } = req.body;
  const userId = req.user.id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Get mnemonic from logged in user
    const mnemonic = user.mnemonic;
    if (!mnemonic) {
      return res.status(400).json({
        success: false,
        message: "User mnemonic not found",
      });
    }
    // Find an account from the user's mnemonic
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
          ipfsCid: tokenImageUrl,
        },
        name: {
          _: tokenName,
        },
        description: {
          _: tokenDescription,
        },
      },
    });

    const tokenId = result.parsed.tokenId;
    console.log(`This is the tokenId: ${tokenId}`);
    const mintTokenCompleted = result.isCompleted;
    console.log(`Token minting completed: ${mintTokenCompleted}`);

    if (!mintTokenCompleted) {
      return res.status(400).json({
        success: false,
        message: "Failed to mint token. No tokenId received.",
      });
    }

    if (!tokenId) {
      return res.status(400).json({
        success: false,
        message: "Failed to mint token. No tokenId received.",
      });
    }

    // Find the collection and add the new token
    // const isWinningToken = Math.random() < 0.1;
    // console.log(isWinningToken);

    const mintToken = await TokenModel.create({
      tokenName,
      tokenId,
      collectionId,
      tokenImageUrl,
      tokenOwnerAddress: address,
      tokenOwnerId: user._id,
      tokenDescription,
      priceOfCoupon,
      quantityAvailable,
      tokenUrl: `https://uniquescan.io/opal/tokens/${collectionId}/${tokenId}`,
      // isWinningToken,
    });

    return res.status(200).json({
      success: true,
      message: "Token minted successfully",
      mintToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message ? error.message : error,
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

// controller to get all tokens owned by a user
export const getUserToken = async (req, res) => {
  const userId = req.user.id;

  const user = await UserModel.find({ _id: userId });
  const userAddress = user[0].accountAddress;
  try {
    const tokens = await TokenModel.find({ tokenOwnerAddress: userAddress });
    if (tokens && tokens.length <= 0) {
      return res.status(200).json({
        success: true,
        message: "No tokens created for this user",
      });
    }
    // console.log("tokens: ", tokens);
    res.status(200).json({
      success: true,
      tokens,
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
      .populate({ path: "wonPrizes", strictPopulate: false });
    // .populate("wonPrizes");
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

export const createSpecialToken = async (req, res) => {
  const { collectionId, tokenName, tokenDescription, tokenImageUrl } = req.body;
  const userId = req.user.id;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //Get mnemonic from logged in user
    const mnemonic = user.mnemonic;
    if (!mnemonic) {
      return res.status(400).json({
        success: false,
        message: "User mnemonic not found",
      });
    }

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
          ipfsCid: tokenImageUrl,
        },
        name: {
          _: tokenName,
        },
        description: {
          _: tokenDescription,
        },
      },
    });

    const tokenId = result.parsed.tokenId;
    console.log(`This is the special tokenId: ${tokenId}`);
    const mintTokenCompleted = result.isCompleted;
    console.log(`Special token minting completed: ${mintTokenCompleted}`);

    if (!mintTokenCompleted) {
      return res.status(400).json({
        success: false,
        message: "Failed to mint special token. No tokenId received.",
      });
    }

    if (!tokenId) {
      return res.status(400).json({
        success: false,
        message: "Failed to mint special token. No tokenId received.",
      });
    }

    const specialToken = await SpecialTokenModel.create({
      collectionId,
      tokenName,
      tokenDescription,
      tokenImageUrl,
      tokenOwnerAddress: address,
      tokenOwnerId: user._id,
      tokenUrl: `https://uniquescan.io/opal/tokens/${collectionId}/${tokenId}`,
    });

    return res.status(200).json({
      success: true,
      message: "Special token created successfully",
      specialToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message ? error.message : error,
    });
  }
};
