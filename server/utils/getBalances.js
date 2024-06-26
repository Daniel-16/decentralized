import Sdk from "@unique-nft/sdk";

const options = {
  baseUrl: process.env.BASE_URL,
};

export const getBalance = (_req, res) => {
  try {
    const sdk = new Sdk(options);
    const { address, availableBalance, lockedBalance, freeBalance } =
      sdk.balance.get({ address });
    res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
