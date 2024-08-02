import ItemModel from "../models/ItemsModel.js";
import StoreModel from "../models/StoreModel.js";

export const createItem = async (req, res) => {
  const { nameOfItem, priceOfItem, storeId } = req.body;
  try {
    const store = await StoreModel.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        error: "Store not found",
      });
    }
    const newItem = await ItemModel.create({
      nameOfItem,
      priceOfItem,
      itemOwnerId: storeId,
      itemOwner: store.nameOfStore,
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
