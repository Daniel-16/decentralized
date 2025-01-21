import UserModel from "../models/UserModel.js";

export const assignDailyPoints = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();
    const lastAssigned = user.lastPointsAssigned;

    if (!lastAssigned || now - lastAssigned > 24 * 60 * 60 * 1000) {
      user.points += 3;
      user.lastPointsAssigned = now;
      await user.save();
    }
  } catch (error) {
    console.error("Error assigning daily points:", error);
  }
};
