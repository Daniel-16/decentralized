import Sdk from "@unique-nft/sdk";
import { KeyringProvider } from "@unique-nft/accounts/keyring";

const baseUrl = "https://rest.unique.network/opal/v1";

function createSdk(account) {
  const options = {
    baseUrl,
    signer: account,
  };
  return new Sdk(options);
}

async function createCollection(sdk, address) {
  const { parsed, error } = await sdk.collection.create.submitWaitResult({
    address,
    name: "Test collection",
    description: "This is a test collection",
    tokenPrefix: "TST",
  });

  if (error) {
    throw new Error(`The error occurred while creating a collection: ${error}`);
  }

  const { collectionId } = parsed;
  return sdk.collection.get({ collectionId });
}

export const createCollectionController = async (req, res) => {
  const { mnemonic } = req.body;

  if (!mnemonic) {
    return res.status(400).json({
      message: "Mnemonic is required",
    });
  }

  try {
    const signer = await KeyringProvider.fromMnemonic(mnemonic);
    const address = signer.instance.address;
    const sdk = createSdk(signer);

    const collection = await createCollection(sdk, address);
    res.status(200).json({
      message: "The collection was created successfully",
      collection,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while creating the collection",
      error: error.message,
    });
  }
};
