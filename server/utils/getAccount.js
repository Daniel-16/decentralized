import { Sr25519Account } from "@unique-nft/sr25519";

// console.log(account);

export const getAccount = async (req, res) => {
  const mnemonic = Sr25519Account.generateMnemonic();
  const account = Sr25519Account.fromUri(mnemonic);
  try {
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
