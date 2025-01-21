import UserModel from "../models/UserModel.js";
import cron from "node-cron";

export const logHighPointUsers = async () => {
  try {
    const highPointUsers = await UserModel.find({
      points: { $gte: 100 },
    })
      .select("username email points")
      .lean();

    if (highPointUsers.length > 0) {
      console.log("Users with 100+ points:", new Date().toISOString());
      highPointUsers.forEach((user) => {
        console.log(
          `Username: ${user.username}, Email: ${user.email}, Points: ${user.points}`
        );
      });
    } else {
      console.log("No users with 100+ points found:", new Date().toISOString());
    }
  } catch (error) {
    console.error("Error logging high point users:", error);
  }
};

//Run every day at 12:00 AM
cron.schedule("0 0 * * *", logHighPointUsers);
