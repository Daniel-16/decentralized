import Sdk, { CHAIN_CONFIG } from "@unique-nft/sdk";
import { KeyringProvider } from "@unique-nft/accounts/keyring";

export const createCollectionAndTokenController = async (req, res) => {
  const {
    mnemonic,
    tokenName,
    tokenDescription,
    tokenPrefix,
    collectionName,
    collectionDesc,
  } = req.body;

  if (
    !mnemonic ||
    !tokenPrefix ||
    !tokenName ||
    !tokenDescription ||
    !collectionName ||
    !collectionDesc
  ) {
    return res.status(400).json({
      message:
        "Mnemonic, tokenPrefix, tokenName, tokenDescription, collection name, and collection description are required",
    });
  }

  try {
    const account = await KeyringProvider.fromMnemonic(mnemonic);
    const address = account.address;

    const sdk = new Sdk({
      baseUrl: CHAIN_CONFIG.opal.restUrl,
      signer: account,
    });

    const { parsed, error } = await sdk.collection.create.submitWaitResult({
      address,
      name: "Munch Box",
      description: "This is a collection for munch box",
      tokenPrefix: tokenPrefix,
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

    res.status(200).json({
      message: "Collection and token created successfully",
      collectionId,
      tokenId,
      collectionUrl: `https://uniquescan.io/opal/collections/${collectionId}`,
      tokenUrl: `https://uniquescan.io/opal/tokens/${collectionId}/${tokenId}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while creating the collection and token",
      error: error.message,
    });
  }
};