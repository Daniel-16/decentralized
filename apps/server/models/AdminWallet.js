import mongoose from "mongoose";

const AdminWalletSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "Platform fee collection wallet",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const AdminWalletModel = mongoose.model("AdminWallet", AdminWalletSchema);
export default AdminWalletModel;
