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
import { createCollectionController } from "../utils/getUserBalance.js";
import { createCollectionAndTokenController } from "../controllers/MintToken.js";
import { createUser, loginUser } from "../controllers/UserController.js";
import { createItem, getAllItems } from "../controllers/ItemsController.js";
// import { getBalance } from "../utils/getBalances.js";
// import { getSdk } from "../utils/getAccount.js";
// import { getAccount } from "../utils/getAccount.js";
const router = express.Router();

router.post("/createUser", createUser);
router.post("/loginUser", loginUser);
router.post("/createStore", createStore);
router.post("/createService/:storeId", createService);
router.post("/createCoupon/:storeId", createCoupon);
router.post("/createAccount", createAccount);
router.get("/getAccount", getAccount);
// router.get("/getBalance", getBalance);
router.get("/getStores", getStores);
router.get("/getServices", getServices);
router.get("/getCoupons", getCoupons);
router.put("/redeemCoupon", redeemCoupon);
router.post("/createCollection", createCollectionController);
router.post("/mintToken", createCollectionAndTokenController);

router.post("/createItem", createItem);
router.get("/allItems", getAllItems);
// router.get("/getSdk", getSdk);

export default router;
