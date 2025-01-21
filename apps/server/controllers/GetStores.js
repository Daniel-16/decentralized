import UserModel from "../models/UserModel.js";

export const getStores = async (req, res) => {
  try {
    const stores = await UserModel.find({ isAdmin: true });
    res.status(200).json({
      success: true,
      stores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
