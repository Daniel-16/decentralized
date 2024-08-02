import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  nameOfItem: {
    type: String,
    required: true,
  },
  priceOfItem: {
    type: Number,
    required: true,
  },
  itemOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
});
