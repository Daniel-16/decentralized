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
  itemOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemOwner: {
    type: mongoose.Schema.Types.String,
    ref: "Store",
    required: true,
  },
});

const ItemModel = mongoose.model("Item", ItemSchema);
export default ItemModel;
