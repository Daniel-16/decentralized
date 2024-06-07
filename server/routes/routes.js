import express from "express";
import { createService, createStore } from "../controllers/StoreController.js";
const router = express.Router();

// router.post("/createUser", createU)
router.post("/createStore", createStore);
router.post("/createService/:storeId", createService);

export default router;
