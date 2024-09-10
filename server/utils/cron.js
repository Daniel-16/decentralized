import cron from "node-cron";
import { attachTokenToItem } from "./attackTokenToItem.js";

cron.schedule("15 14 * * *", () => {
  attachTokenToItem();
  console.log("Attacked token to an item");
});
