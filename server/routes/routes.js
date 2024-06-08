import express from "express";
import {
  createCoupon,
  createService,
  createStore,
} from "../controllers/StoreController.js";
const router = express.Router();

// router.post("/createUser", createU)
router.post("/createStore", createStore);
router.post("/createService/:storeId", createService);
router.post("/createCoupon/:storeId", createCoupon);

export default router;
