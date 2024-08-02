import TransactionModel from "../models/TransactionModel.js";
import ItemModel from "../models/ItemsModel.js";

export const purchaseItem = async (req, res) => {
  const { itemId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const item = await ItemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }

    const totalPrice = item.priceOfItem * quantity;

    const transaction = new TransactionModel({
      user: userId,
      item: itemId,
      store: item.itemOwnerId,
      quantity,
      totalPrice,
    });

    await transaction.save();

    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUserTransactions = async (req, res) => {
  const userId = req.user.id; // Assuming you have middleware to extract user from token

  try {
    const transactions = await TransactionModel.find({ user: userId })
      .populate("item")
      .populate("store");

    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
