// import cron from "node-cron";
import { attachTokenToItem } from "../controllers/ItemsController.js";

// cron.schedule("15 14 * * *", () => {
//   attachTokenToItem();
// });

setTimeout(() => {
  attachTokenToItem();
  console.log("Attached token to item");
}, 10000);
