import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  tokenId: Number,
  collectionId: Number,
  tokenName: String,
  tokenImageUrl: String,
  tokenOwnerAddress: String,
  tokenOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: ["pizza", "coffee", "delivery"],
    required: true,
  },
  tokenDescription: String,
  tokenUrl: String,
  priceOfCoupon: {
    type: Number,
    default: 0,
    required: true,
  },
  finalPriceOfCoupon: {
    type: Number,
    default: function () {
      return this.priceOfCoupon * 1.05;
    },
    required: true,
  },
  isPurchased: {
    type: Boolean,
    default: false,
  },
  isItem: {
    type: Boolean,
    default: false,
  },
  metadata: {
    storeAddress: String,
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
});

const TokenModel = mongoose.model("Token", TokenSchema);
export default TokenModel;
