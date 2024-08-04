import Sdk from "@unique-nft/sdk";

export const getBalance = async () => {
  const { inputAddress } = req.body;
  try {
    const options = {
      baseUrl: "https://rest.unique.network/opal/v1",
    };
    const sdk = new Sdk(options);
    const result = await sdk.balance.get({ address: inputAddress });
    console.log(result);

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
      error: error.message,
    });
  }
};
