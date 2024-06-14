import { Sr25519Account } from "@unique-nft/sr25519";

export const createAccount = async (req, res) => {
  try {
    const mnemonic = Sr25519Account.generateMnemonic();
    const account = Sr25519Account.fromUri(mnemonic);
    res.status(201).json({
      success: true,
      account,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
