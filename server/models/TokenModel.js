import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  tokenId: String,
  tokenName: String,
  tokenOwnerAddress: String,
  tokenCreator: {
    type: mongoose.Schema.Types.String,
    ref: "User",
  },
  tokenDescription: String,
  tokenUrl: String,
});

const TokenModel = mongoose.model("Token", TokenSchema);
export default TokenModel;
