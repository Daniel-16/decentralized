import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // required: true,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    // required: true,
    minLength: 6,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  accountAddress: {
    type: String,
    required: true,
  },
  // evmAddress: {
  //   type: String,
  //   required: true,
  // },
  collectedTokens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Token",
    },
  ],
  mnemonic: {
    type: String,
    // required: true,
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  points: {
    type: Number,
    default: 0,
  },
  lastPointsAssigned: {
    type: Date,
    default: null,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  lastStreakUpdate: {
    type: Date,
    default: null,
  },
  highestStreak: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profileImageUrl: {
    type: String,
    default: "",
  },
  firstUse: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
