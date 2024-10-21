import mongoose from "mongoose";

const SpecialTokenSchema = new mongoose.Schema({
  tokenId: {
    type: Number,
    required: true,
  },
  collectionId: {
    type: Number,
    required: true,
  },
  tokenName: String,
  tokenImageUrl: String,
  tokenOwnerAddress: String,
  tokenOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tokenDescription: String,
  tokenUrl: String,
  wonByUser: {
    type: Boolean,
    default: false,
  },
  priceOfCoupon: {
    type: Number,
    default: 0,
    required: true,
  },
  //   quantityAvailable: {
  //     type: Number,
  //     default: 1,
  //   },
});

const SpecialTokenModel = mongoose.model("SpecialToken", SpecialTokenSchema);

export default SpecialTokenModel;
