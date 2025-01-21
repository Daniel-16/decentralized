import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  buyerName: {
    type: mongoose.Schema.Types.String,
    ref: "User",
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Token",
    required: true,
  },
  storeOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  nameOfItemPurchased: {
    type: mongoose.Schema.Types.String,
    ref: "Token",
  },
});

const TransactionModel = mongoose.model("Transaction", TransactionSchema);
export default TransactionModel;
