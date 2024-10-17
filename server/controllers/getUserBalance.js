import Sdk from "@unique-nft/sdk";
import UserModel from "../models/UserModel.js";

export const getUserBalance = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const wallet_address = user.accountAddress;

    const options = {
      baseUrl: "https://rest.unique.network/opal/v1",
    };
    const sdk = new Sdk(options);
    const result = await sdk.balance.get({ address: wallet_address });

    const { address, availableBalance } = result;

    // Update the user's wallet balance
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { walletBalance: availableBalance.amount },
      { new: true }
    );

    res.status(200).json({
      success: true,
      address,
      availableBalance,
      userBalance: updatedUser.walletBalance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred while fetching the balance",
    });
  }
};
