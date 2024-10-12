import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  nameOfItem: {
    type: String,
    required: true,
  },
  itemImage: {
    type: String,
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
  itemOwnerAddress: {
    type: mongoose.Schema.Types.String,
    ref: "User",
    required: true,
  },
  itemOwner: {
    type: mongoose.Schema.Types.String,
    ref: "User",
    required: true,
  },
  attachedToken: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Token",
    default: null,
  },
});

const ItemModel = mongoose.model("Item", ItemSchema);
export default ItemModel;
