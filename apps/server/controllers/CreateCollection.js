import Sdk from "@unique-nft/sdk";
import { KeyringProvider } from "@unique-nft/accounts/keyring";

export const createTestCollection = async (req, res) => {
  const { mnemonic, name, description, tokenPrefix } = req.body;

  if (!mnemonic) {
    return res.status(400).json({
      success: false,
      error: "Mnemonic is required",
    });
  }

  try {
    const baseUrl = "https://rest.unique.network/opal/v1";

    // Creating a signer from the mnemonic
    const signer = await KeyringProvider.fromMnemonic(mnemonic);
    const address = signer.address;

    // Creating an SDK client
    const options = {
      baseUrl,
      signer,
    };
    const sdk = new Sdk(options);

    // Creating a sample collection
    const { parsed, error } = await sdk.collection.create.submitWaitResult({
      address,
      name,
      description,
      tokenPrefix,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: "The error occurred while creating a collection: " + error,
      });
    }

    const { collectionId } = parsed;
    const collection = await sdk.collection.get({ collectionId });

    res.status(200).json({
      success: true,
      message: "The collection was created successfully",
      collectionId: collectionId,
      collectionDetails: collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
