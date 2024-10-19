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
  // isWinningToken: {
  //   type: Boolean,
  //   default: false,
  // },
  priceOfCoupon: {
    type: Number,
    default: 0,
    required: true,
  },
  isPurchased: {
    type: Boolean,
    default: false,
  },
  // quantityAvailable: {
  //   type: Number,
  //   default: 1,
  // },
});

const TokenModel = mongoose.model("Token", TokenSchema);
export default TokenModel;
