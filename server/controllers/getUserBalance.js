import Sdk from "@unique-nft/sdk";

export const getUserBalance = async (req, res) => {
  // const { walletAddress } = req.body;
    const walletAddress = req.query.wallet_address;
  try {
    const options = {
      baseUrl: "https://rest.unique.network/opal/v1",
    };
    const sdk = new Sdk(options);
    const result = await sdk.balance.get({ address: walletAddress });

    const { address, availableBalance, lockedBalance, freeBalance } = result;
    res.status(200).json({
      success: true,
      address,
      availableBalance,
      lockedBalance,
      freeBalance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};
