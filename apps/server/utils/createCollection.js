// import Sdk from "@unique-nft/sdk";
// import { KeyringProvider } from "@unique-nft/accounts/keyring";

// const baseUrl = "https://rest.unique.network/opal/v1";
// const mnemonic =
//   "bus ahead nation nice damp recall place dance guide media clap language";

// // Creating an SDK client
// function createSdk(account) {
//   const options = {
//     baseUrl,
//     signer: account,
//   };
//   return new Sdk(options);
// }

// // Creating a sample collection
// // The signer specified in the SDK constructor is used to sign an extrinsic
// export async function createCollection(sdk, address) {
//   const { parsed, error } = await sdk.collection.create.submitWaitResult({
//     address,
//     name: "Test collection",
//     description: "This is a test collection",
//     tokenPrefix: "TST",
//   });

//   if (error) {
//     console.log("The error occurred while creating a collection. ", error);
//     process.exit();
//   }

//   const { collectionId } = parsed;

//   return sdk.collection.get({ collectionId });
// }

// // Entrypoint
// async function main() {
//   const signer = await KeyringProvider.fromMnemonic(mnemonic);
//   const address = signer.address;

//   const sdk = createSdk(signer);

//   const collection = await createCollection(sdk, address);
//   console.log("The collection was create. ID: ", collection);
// }

// main();
