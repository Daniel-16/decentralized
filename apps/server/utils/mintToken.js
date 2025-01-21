import Sdk, { CHAIN_CONFIG } from "@unique-nft/sdk";
import { KeyringProvider } from "@unique-nft/accounts/keyring";

async function main() {
  const account = await KeyringProvider.fromMnemonic(
    "bus ahead nation nice damp recall place dance guide media clap language"
  );
  const address = account.address;

  const sdk = new Sdk({
    baseUrl: CHAIN_CONFIG.opal.restUrl,
    signer: account,
  });

  const { parsed, error } = await sdk.collection.create.submitWaitResult({
    address,
    name: "Test collection",
    description: "My test collection",
    tokenPrefix: "TST",
  });

  if (error) {
    console.log("create collection error", error);
    process.exit();
  }
  const collectionId = parsed?.collectionId;
  console.log(`Collection created. Id: ${collectionId}`);
  console.log(
    `View this minted collection at https://uniquescan.io/opal/collections/${collectionId}`
  );

  const result = await sdk.token.create.submitWaitResult({
    address,
    collectionId,
    data: {
      image: {
        ipfsCid: "QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png",
      },
      name: {
        _: "My token",
      },
      description: {
        _: "This is a test token",
      },
    },
  });

  const tokenId = result.parsed?.tokenId;

  console.log(
    `Minted token ID ${tokenId} of 1 in collection ID ${collectionId}`
  );
  console.log(
    `View this minted token at https://uniquescan.io/opal/tokens/${collectionId}/${tokenId}`
  );
}

main().catch((error) => {
  console.error(error);
});
