import ItemModel from "../models/ItemsModel.js";
import UserModel from "../models/UserModel.js";

export const createItem = async (req, res) => {
  const { nameOfItem, itemImage, priceOfItem } = req.body;
  const userId = req.user.id;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    const newItem = await ItemModel.create({
      nameOfItem,
      itemImage,
      priceOfItem,
      itemOwnerId: user._id,
      itemOwner: user.username || user.email,
    });
    res.status(201).json({
      success: true,
      newItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await ItemModel.find({});
    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getStoreItems = async (req, res) => {
  const userId = req.user.id;
  try {
    const items = await ItemModel.find({ itemOwnerId: userId });
    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}