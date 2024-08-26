import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  tokenName: String,
  tokenDescription: String,
  tokenUrl: String,
});

const TokenModel = mongoose.model("Token", TokenSchema);
export default TokenModel;
