import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: {
    type: String,
  },
  accountAddress: {
    type: String,
  },
  hasReceivedToken: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function (next) {
  const email = this.email;
  const user = await UserModel.findOne({ email });
  try {
    if (user) {
      const emailExist = new Error("An account with this email already exists");
      return next(emailExist);
    }
  } catch (error) {
    throw new Error(error);
  }

  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt);
  next();
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
