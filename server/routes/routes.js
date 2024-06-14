import express from "express";
import {
  createCoupon,
  createService,
  createStore,
} from "../controllers/StoreController.js";
import { createAccount } from "../utils/createAccount.js";
import { getAccount } from "../utils/getAccount.js";
const router = express.Router();

// router.post("/createUser", createU)
router.post("/createStore", createStore);
router.post("/createService/:storeId", createService);
router.post("/createCoupon/:storeId", createCoupon);
router.get("/createAccount", createAccount);
router.get("/getAccount", getAccount);

export default router;
