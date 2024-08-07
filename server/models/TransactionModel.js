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
    ref: "Item",
    required: true,
  },
  // store: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Store",
  //   required: true,
  // },
  itemName: {
    type: mongoose.Schema.Types.String,
    ref: "Item",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

const TransactionModel = mongoose.model("Transaction", TransactionSchema);
export default TransactionModel;
