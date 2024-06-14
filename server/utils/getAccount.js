// import { Accounts } from "@unique-nft/accounts";
// import { KeyringLocalProvider } from "@unique-nft/accounts/keyring-local";
// import {
//   PolkadotAccount,
//   PolkadotProvider,
// } from "@unique-nft/accounts/polkadot";

// export const getAccount = async (_req, res) => {
//   try {
//     const accounts = new Accounts();
//     const provider = new PolkadotProvider({ accountType: ["sr25519"] });
//     await provider.init();
//     const _accountList = await provider.getAccounts();
//     res.status(201).json({
//       signer,
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };
