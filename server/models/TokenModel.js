import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  tokenId: String,
  tokenName: String,
  tokenOwnerAddress: String,
  tokenDescription: String,
  tokenUrl: String,
});

const TokenModel = mongoose.model("Token", TokenSchema);
export default TokenModel;
