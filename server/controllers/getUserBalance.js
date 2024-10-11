import Sdk from "@unique-nft/sdk";

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
      error: error.message || "An error occurred while fetching the balance",
    });
  }
};
