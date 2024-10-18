import mongoose from "mongoose";

const SpecialTokenSchema = new mongoose.Schema({
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
  wonByUser: {
    type: Boolean,
    default: false,
  },
  //   quantityAvailable: {
  //     type: Number,
  //     default: 1,
  //   },
});

const SpecialTokenModel = mongoose.model("SpecialToken", SpecialTokenSchema);

export default SpecialTokenModel;
