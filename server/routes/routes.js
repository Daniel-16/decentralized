import express from "express";
import {
  createCoupon,
  createService,
  createStore,
  getCoupons,
  getServices,
  getStores,
  redeemCoupon,
} from "../controllers/StoreController.js";
import { createAccount } from "../utils/createAccount.js";
// import { getBalance } from "../utils/getBalances.js";
// import { getSdk } from "../utils/getAccount.js";
// import { getAccount } from "../utils/getAccount.js";
const router = express.Router();

// router.post("/createUser", createU)
router.post("/createStore", createStore);
router.post("/createService/:storeId", createService);
router.post("/createCoupon/:storeId", createCoupon);
router.get("/createAccount", createAccount);
// router.get("/getAccount", getAccount);
// router.get("/getBalance", getBalance);
router.get("/getStores", getStores);
router.get("/getServices", getServices);
router.get("/getCoupons", getCoupons);
router.put("/redeemCoupon", redeemCoupon);

// router.get("/getSdk", getSdk);

export default router;
