import UserModel from "../models/UserModel.js";

export const updateLoginStreak = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();
    const lastUpdate = user.lastStreakUpdate;
    
    if (!lastUpdate) {
      // First login ever
      user.currentStreak = 1;
      user.highestStreak = 1;
      user.lastStreakUpdate = now;
    } else {
      const timeDiff = now - lastUpdate;
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        // Consecutive day login
        user.currentStreak += 1;
        if (user.currentStreak > user.highestStreak) {
          user.highestStreak = user.currentStreak;
        }
      } else if (daysDiff > 1) {
        // Streak broken
        user.currentStreak = 1;
      }
      // If daysDiff === 0, user has already logged in today, don't update streak
      if (daysDiff >= 1) {
        user.lastStreakUpdate = now;
      }
    }

    await user.save();
    return {
      currentStreak: user.currentStreak,
      highestStreak: user.highestStreak
    };
  } catch (error) {
    console.error("Error updating login streak:", error);
    return null;
  }
};
