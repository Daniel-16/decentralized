import TokenModel from "../models/TokenModel.js";

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
