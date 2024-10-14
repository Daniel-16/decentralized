import Sdk from "@unique-nft/sdk";
import UserModel from "../models/UserModel.js";
/**
 * Get the balance of a user's wallet
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with wallet balance information
 *
 * @description
 * This function retrieves the balance of a user's wallet using the Unique Network SDK.
 * It expects a 'wallet_address' query parameter in the request.
 * The function returns the address, available balance, locked balance, and free balance.
 *
 * @example
 * GET /api/getUserBalance?wallet_address=5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty
 *
 * Response:
 * {
 *   "success": true,
 *   "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
 *   "availableBalance": "1000000000000",
 *   "lockedBalance": "0",
 *   "freeBalance": "1000000000000"
 * }
 */
export const getUserBalance = async (req, res) => {
  const { wallet_address } = req.params;

  if (!wallet_address) {
    return res.status(400).json({
      success: false,
      error: "Wallet address is required",
    });
  }

  try {
    const options = {
      baseUrl: "https://rest.unique.network/opal/v1",
    };
    const sdk = new Sdk(options);
    const result = await sdk.balance.get({ address: wallet_address });

    const { address, availableBalance } = result;

    // Find the user with the given wallet address and update their wallet balance
    const updatedUser = await UserModel.findOneAndUpdate(
      { accountAddress: wallet_address },
      { walletBalance: availableBalance.amount },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found with the given wallet address",
      });
    }

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
