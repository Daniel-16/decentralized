import UserModel from "../models/UserModel.js";

export const checkWinningUser = async () => {
  try {
    const users = await UserModel.find({ collectedTokens: { $exists: true } });
    const winningUsers = users.filter(
      (user) =>
        Array.isArray(user.collectedTokens) && user.collectedTokens.length === 3
    );

    if (winningUsers.length > 0) {
      console.log("Users with at least three tokens:");
      winningUsers.forEach((user) => {
        console.log(`User ID: ${user._id}, Username: ${user.username}`);
      });
    } else {
      // No winning users found
      return [];
    }
    return winningUsers;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
