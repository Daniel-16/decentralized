import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../middleware/generateToken.js";
import { Sr25519Account } from "@unique-nft/sr25519";
import { getUserBalance } from "./getUserBalance.js";
// import { Address } from "@unique-nft/utils";
import { assignDailyPoints } from "../utils/dailyPoints.js";
import { updateLoginStreak } from "../utils/streakHandler.js";

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

    // Generate a DiceBear avatar URL using the username
    const avatarUrl = `https://api.dicebear.com/6.x/identicon/svg?seed=${encodeURIComponent(
      username
    )}`;

    // const ethMirror = Address.mirror.substrateToEthereum(account.address);

    const user = await UserModel.create({
      username,
      email,
      password,
      accountAddress: account.address,
      // evmAddress: ethMirror,
      mnemonic,
      points: 10,
      lastPointsAssigned: new Date(),
      profileImageUrl: avatarUrl,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        accountAddress: user.accountAddress,
        // evmAddress: user.evmAddress,
        profileImageUrl: user.profileImageUrl,
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

    // Update firstUse if it's the user's first login
    if (!user.firstUse) {
      user.firstUse = true;
      await user.save();
    }

    // Update login streak
    const streakInfo = await updateLoginStreak(user._id);

    // Assign daily points
    await assignDailyPoints(user._id);

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        currentStreak: streakInfo.currentStreak,
        highestStreak: streakInfo.highestStreak,
      },
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

// Get top 10 users by points for leaderboard
// export const getLeaderboard = async (req, res) => {
//   try {
//     const leaderboard = await UserModel.find().sort({ points: -1 }).limit(10);
//     res.status(200).json({
//       success: true,
//       leaderboard,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

// Get paginated leaderboard
// Get paginated leaderboard excluding users with 0 points
export const getLeaderboard = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    // Get the total count of non-admin users with points > 0
    const totalUsers = await UserModel.countDocuments({ 
      points: { $gt: 0 },
      isAdmin: false 
    });
    const totalPages = Math.ceil(totalUsers / limit);

    // Fetch the leaderboard for the current page (non-admin users with points > 0)
    const leaderboard = await UserModel.find({ 
      points: { $gt: 0 },
      isAdmin: false
    })
      .sort({ points: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Mock percentage changes for 1-day and 7-day
    const enhancedLeaderboard = leaderboard.map((user, index) => ({
      position: (page - 1) * limit + index + 1, 
      username: user.username,
      points: user.points,
      last1DayChange: ((Math.random() * 2 - 1) * 2).toFixed(2), 
      last7DaysChange: ((Math.random() * 2 - 1) * 5).toFixed(2), 
    }));

    res.status(200).json({
      success: true,
      leaderboard: enhancedLeaderboard,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const createUserWithPolkadot = async (req, res) => {
  const { address, username } = req.body;

  try {
    const userExist = await UserModel.findOne({ accountAddress: address });

    if (userExist) {
      return res.status(409).json({
        success: false,
        error: "User with this wallet address already exists"
      });
    }

    const avatarUrl = `https://api.dicebear.com/6.x/identicon/svg?seed=${encodeURIComponent(username)}`;

    const user = await UserModel.create({
      username,
      accountAddress: address,
      points: 10,
      lastPointsAssigned: new Date(),
      profileImageUrl: avatarUrl
    });

    // const token = generateToken(user);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        accountAddress: user.accountAddress,
        profileImageUrl: user.profileImageUrl
      },
      // token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const loginWithPolkadot = async (req, res) => {
  const { address, username} = req.body;
  
  try {
    const user = await UserModel.findOne({ accountAddress: address });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "No user found with this wallet address"
      });
    }

    // Verify the signature here
    // This would require implementing signature verification logic
    // specific to Polkadot's cryptography

    // Update firstUse if it's the user's first login
    if (!user.firstUse) {
      user.firstUse = true;
      await user.save();
    }

    // Update login streak
    const streakInfo = await updateLoginStreak(user._id);

    // Assign daily points
    await assignDailyPoints(user._id);

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        currentStreak: streakInfo.currentStreak,
        highestStreak: streakInfo.highestStreak,
        username
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};