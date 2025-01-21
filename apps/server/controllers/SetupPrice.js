// import { hexToNumber } from "@polkadot/util";
// import Sdk, { CHAIN_CONFIG } from "@unique-nft/sdk";

// const sdk = new Sdk({
//   baseUrl: CHAIN_CONFIG.opal.restUrl,
//   signer: account,
// });
// const { parsed, blockHash } = await sdk.extrinsic.status({ hash: txHash });

// if (!parsed) {
//   throw new Error("Extrinsic is not completed or does not exist");
// }

// const { args } = await sdk.extrinsics.get({
//   blockHashOrNumber: blockHash,
//   extrinsicHash: txHash,
// });

// const [from, to, collectionIdEncoded, tokenIdEncoded, valueEncoded] =
//   args || [];

// const collectionId = hexToNumber(collectionIdEncoded);
// const tokenId = hexToNumber(tokenIdEncoded);
// const value = hexToNumber(valueEncoded);

// if (
//   from.substrate !== seller ||
//   to.substrate !== getEscrowAddress() || // marketplace wallet address
//   value !== 1
// )
//   throw new Error("Extrinsic is not valid");

// // save offer to DB
// const collection = await sdk.collection.get({ collectionId });
// const token = await sdk.token.get({ collectionId, tokenId });

// const { name, tokenPrefix } = collection;
// const { image } = token;

// // in our example - this will save offer to file
// await appendOffer({
//   collectionId,
//   tokenId,
//   seller,
//   price,
//   tokenDescription: {
//     collectionName: name,
//     prefix: tokenPrefix,
//     imageUrl: image.fullUrl || "",
//   },
// });
