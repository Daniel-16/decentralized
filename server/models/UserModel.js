import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  accountAddress: {
    type: String,
  },
  collectedTokens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Token",
    },
  ],
  wonPrizes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prize",
    },
  ],
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
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
