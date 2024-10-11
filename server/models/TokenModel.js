import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  tokenId: String,
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
  isWinningToken: {
    type: Boolean,
    default: false,
  },
});

const TokenModel = mongoose.model("Token", TokenSchema);
export default TokenModel;
