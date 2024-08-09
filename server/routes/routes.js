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
import { getAccount } from "../utils/getAccount.js";
import {
  createCollectionAndTokenController,
  mintToken,
} from "../controllers/CreateAndMintToken.js";
import {
  createUser,
  getUser,
  loginUser,
} from "../controllers/UserController.js";
import { createItem, getAllItems } from "../controllers/ItemsController.js";
import { verifyToken } from "../middleware/generateToken.js";
import {
  checkPurchases,
  checkStorePurchases,
  getUserTransactions,
  purchaseItem,
} from "../controllers/TransactionController.js";
import { getUserBalance } from "../controllers/getUserBalance.js";
// import { createCollection } from "../utils/createCollection.js";
import { createTestCollection } from "../controllers/CreateCollection.js";
import { transferTokenController } from "../controllers/TransferToken.js";
// import { getBalance } from "../utils/getBalances.js";
// import { getSdk } from "../utils/getAccount.js";
// import { getAccount } from "../utils/getAccount.js";
const router = express.Router();

router.post("/createUser", createUser);
router.post("/loginUser", loginUser);
router.get("/getUser", verifyToken, getUser);
router.post("/createStore", createStore); //Not in use for now
router.post("/createService/:storeId", createService); //Not in use for now
router.post("/createCoupon/:storeId", createCoupon); //Not in use for now
router.post("/createAccount", createAccount); //Not in use for now
router.get("/getAccount", getAccount); //Not in use for now
router.get("/getStores", getStores); //Not in use for now
router.get("/getServices", getServices); //Not in use for now
router.get("/getCoupons", getCoupons); //Not in use for now
router.put("/redeemCoupon", redeemCoupon); //Not in use for now
// router.post("/createCollection", createCollectionController);
// router.post("/mintToken", createCollectionAndTokenController);

router.post("/createItem", verifyToken, createItem);
router.get("/getItems", getAllItems);

router.post("/purchaseItem", verifyToken, purchaseItem);
router.get("/getTransactions", verifyToken, getUserTransactions);

router.get("/getUserBalance", getUserBalance);
router.post("/createCollection", createTestCollection);
router.post("/createAndMint", verifyToken, createCollectionAndTokenController);
router.post("/transferToken", transferTokenController);
router.post("/mintToken", verifyToken, mintToken);

router.get("/purchases", verifyToken, checkPurchases);
router.get("/checkStorePurchases", verifyToken, checkStorePurchases);

export default router;
