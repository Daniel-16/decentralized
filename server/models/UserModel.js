import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: String,
  address: String,
  mnemonic: String,
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
