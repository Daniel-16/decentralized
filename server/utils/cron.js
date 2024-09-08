import cron from "node-cron";
import { attachTokenToItem } from "../controllers/ItemsController.js";

cron.schedule("15 14 * * *", () => {
  attachTokenToItem();
});
