import cron from "node-cron";
import { checkWinningUser } from "./checkWinningUser.js";

cron.schedule("*/5 * * * *", async () => {
  try {
    await checkWinningUser();
  } catch (error) {
    console.error("Error in scheduled task: ", error);
  }
});
