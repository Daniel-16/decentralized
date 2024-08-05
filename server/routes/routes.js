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
import { createCollectionAndTokenController } from "../controllers/CreateAndMintToken.js";
import {
  createUser,
  getUser,
  loginUser,
} from "../controllers/UserController.js";
import { createItem, getAllItems } from "../controllers/ItemsController.js";
import { verifyToken } from "../middleware/generateToken.js";
import {
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
router.post("/createStore", createStore);
router.post("/createService/:storeId", createService);
router.post("/createCoupon/:storeId", createCoupon);
router.post("/createAccount", createAccount);
router.get("/getAccount", getAccount);
router.get("/getStores", getStores);
router.get("/getServices", getServices);
router.get("/getCoupons", getCoupons);
router.put("/redeemCoupon", redeemCoupon);
// router.post("/createCollection", createCollectionController);
// router.post("/mintToken", createCollectionAndTokenController);

router.post("/createItem", createItem);
router.get("/allItems", getAllItems);

router.get("/purchaseItem", verifyToken, purchaseItem);
router.get("/getTransactions", verifyToken, getUserTransactions);

router.get("/getUserBalance", getUserBalance);
router.post("/createCollection", createTestCollection);
router.post("/createAndMint", createCollectionAndTokenController);
router.post("/transferToken", transferTokenController);

export default router;
