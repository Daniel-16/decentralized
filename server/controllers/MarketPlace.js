import TokenModel from "../models/TokenModel.js";
import UserModel from "../models/UserModel.js";

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await TokenModel.find({ isPurchased: false });
    res.status(200).json({
      success: true,
      coupons,
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
