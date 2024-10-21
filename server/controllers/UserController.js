import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../middleware/generateToken.js";
import { Sr25519Account } from "@unique-nft/sr25519";
import { getUserBalance } from "./getUserBalance.js";

export const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(409).json({
        success: false,
        error: "A user with this email already exist",
      });
    }
    const mnemonic = Sr25519Account.generateMnemonic();
    const account = Sr25519Account.fromUri(mnemonic);
    const user = await UserModel.create({
      username,
      email,
      password,
      accountAddress: account.address,
      mnemonic,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      account,
      mnemonic,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    if (user.collectedTokens.length >= 3) {
      return res.status(200).json({
        message: `Winning user: ${user.username}, email: ${user.email}`,
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// get dashboard view
export const getDashboard = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const balance = await getUserBalance(user.accountAddress);
    const userType = user.isAdmin ? "Store Owner" : "User";

    res.render("admin/dashboard-main", {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        accountAddress: user.accountAddress,
        balance,
        userType,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
