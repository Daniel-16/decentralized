import ItemModel from "../models/ItemsModel.js";
import StoreModel from "../models/StoreModel.js";
import TokenModel from "../models/TokenModel.js";
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

export const attachTokenToItem = async (req, res) => {
  try {
    const items = await ItemModel.find({ attachedToken: null });
    const tokens = await TokenModel.find({});

    for (const item of items) {
      if (Math.random() < 0.1) {
        const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
        item.attachedToken = randomToken._id;
        await item.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Tokens attached to items successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
