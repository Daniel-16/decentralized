import TokenModel from "../models/TokenModel.js";
import UserModel from "../models/UserModel.js";

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await TokenModel.find({
      quantityAvailable: { $gt: 0 },
    });

    const couponsWithOwners = await Promise.all(
      coupons.map(async (coupon) => {
        const ownerDetails = await UserModel.findById(coupon.tokenOwnerId);
        return {
          ...coupon._doc, // get the plain object of the coupon
          ownerName: ownerDetails ? ownerDetails.username : "Unknown",
        };
      })
    );

    res.status(200).json({
      success: true,
      coupons: couponsWithOwners,
      availableCoupons: coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getStoreCoupons = async (req, res) => {
  const { accountAddress } = req.params;
  const userId = req.user.id;

  try {
    const loggedInUser = await UserModel.findById(userId);
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    const storeOwner = await UserModel.findOne({ accountAddress });
    if (!storeOwner) {
      return res.status(404).json({
        success: false,
        error: "Store owner not found",
      });
    }
    const coupons = await TokenModel.find({
      tokenOwnerAddress: accountAddress,
      isPurchased: false,
    });
    res.status(200).json({
      success: true,
      storeOwner,
      coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
