import { Accounts } from "@unique-nft/accounts";
import { KeyringLocalProvider } from "@unique-nft/accounts/keyring-local";

export const getAccount = async (_req, res) => {
  try {
    const accounts = new Accounts();
    await accounts.addProvider(KeyringLocalProvider);

    const accountList = await accounts.getAccounts();
    const signer = accountList[0];
    res.status(201).json({
      signer,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
