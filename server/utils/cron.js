import cron from "node-cron";
import { attachTokenToItem } from "../controllers/ItemsController.js";

cron.schedule("0 0 * * *", () => {
  attachTokenToItem();
});
