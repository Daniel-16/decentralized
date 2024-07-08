// import { Sr25519Account } from "@unique-nft/sr25519";
// import { Sdk } from "@unique-nft/sdk";

// // set "account" as a default signer
// // const sdk = new Sdk({
// //   baseUrl: "https://rest.unique.network/opal/v1",
// //   account,
// // });

// export const getSdk = async (req, res) => {
//   const mnemonic = "<SET THE MNEMONIC SEED PHRASE FOR THE DEFAULT SIGNER>";
//   const account = Sr25519Account.fromUri(mnemonic);
//   try {
//     const sdk = new Sdk({
//       baseUrl: "https://rest.unique.network/opal/v1",
//       account,
//     });
//     res.status(201).json({
//       success: true,
//       sdk,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };
