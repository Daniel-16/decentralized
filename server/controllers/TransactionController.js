import TransactionModel from "../models/TransactionModel.js";
import ItemModel from "../models/ItemsModel.js";
import UserModel from "../models/UserModel.js";

export const purchaseItem = async (req, res) => {
  const { itemId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    const item = await ItemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }

    const totalPrice = item.priceOfItem * quantity;

    const transaction = new TransactionModel({
      buyerId: userId,
      buyerName: user.username || user.email,
      item: itemId,
      itemOwner: item.itemOwner,
      storeOwnerId: item.itemOwnerId,
      itemName: item.nameOfItem,
      // store: item.itemOwnerId,
      quantity,
      totalPrice,
    });

    await transaction.save();

    if (item.attachedToken) {
      await UserModel.findByIdAndUpdate(
        userId,
        { $addToSet: { collectedTokens: item.attachedToken } },
        { new: true }
      );
    }

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const checkBuyerPurchases = async (req, res) => {
  const userId = req.user.id;
  try {
    const purchases = await TransactionModel.find({ buyerId: userId });
    if (purchases.length <= 0) {
      return res.status(200).json({
        success: true,
        message: "No Purchases for this user",
      });
    }
    res.status(200).json({
      success: true,
      purchases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const checkStorePurchases = async (req, res) => {
  const itemOwnerId = req.user.id;

  try {
    const item = await ItemModel.find({ itemOwnerId });
    if (!item) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    // Find all transactions where the itemOwner matches the store owner's ID
    const storePurchases = await TransactionModel.find({
      storeOwnerId: itemOwnerId,
    }).select("buyerId buyerName itemName quantity totalPrice createdAt");

    if (storePurchases.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No purchases have been made from your store yet.",
      });
    }

    // Calculate total sales and items
    const totalSales = storePurchases.reduce(
      (sum, purchase) => sum + purchase.totalPrice,
      0
    );
    const totalItems = storePurchases.reduce(
      (sum, purchase) => sum + purchase.quantity,
      0
    );

    const highestBuyer = storePurchases.reduce((prev, current) => {
      return prev.totalPrice > current.totalPrice ? prev : current;
    });

    res.status(200).json({
      success: true,
      purchases: storePurchases,
      totalSales,
      totalItems,
      totalTransactions: storePurchases.length,
      highestBuyer: {
        buyerId: highestBuyer.buyerId,
        buyerName: highestBuyer.buyerName,
        totalPurchase: highestBuyer.totalPrice,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
