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
  tokenDescription: String,
  tokenUrl: String,
  priceOfCoupon: {
    type: Number,
    default: 0,
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
});

const TokenModel = mongoose.model("Token", TokenSchema);
export default TokenModel;
