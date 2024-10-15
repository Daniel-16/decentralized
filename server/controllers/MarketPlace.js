import TokenModel from "../models/TokenModel.js";
import UserModel from "../models/UserModel.js";

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await TokenModel.find({ isPurchased: false });

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
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
