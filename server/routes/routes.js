import express from "express";
import {
  createCollectionController,
  createSpecialToken,
  getItemsByCategory,
  getUserCollections,
  getUserToken,
  getUserTokensAndPrizes,
  mintToken,
} from "../controllers/CreateAndMintToken.js";
import {
  createUser,
  createUserWithPolkadot,
  getLeaderboard,
  getUser,
  loginUser,
  loginWithPolkadot,
} from "../controllers/UserController.js";
import {
  createItem,
  getAllItems,
  getStoreItems,
} from "../controllers/ItemsController.js";
import { verifyToken } from "../middleware/generateToken.js";
import {
  checkBuyerPurchases,
  checkStorePurchases,
  purchaseCoupon,
  purchaseItem,
} from "../controllers/TransactionController.js";
import { getUserBalance } from "../controllers/getUserBalance.js";
import { transferTokenController } from "../controllers/TransferToken.js";
// import { burnToken } from "../controllers/BurnToken.js";
import {
  getAllCoupons,
  getAllMyCoupons,
  getCoupon,
  getStoreCoupons,
} from "../controllers/MarketPlace.js";
import { getStores } from "../controllers/GetStores.js";
import {
  acceptCouponSwap,
  declineCouponSwap,
  getSwapOffers,
  initiateCouponSwap,
} from "../controllers/SwapCoupons.js";
import {
  acceptRedeemRequest,
  getAllRedeemRequests,
  redeemCoupon,
} from "../controllers/RedeemCoupons.js";
// import { createAdminWallet, getAdminWallet, updateAdminWallet } from "../controllers/AdminWalletController.js";

const router = express.Router();

/**
 * @route POST /api/createUser
 * @description Create a new user
 * @access Public
 */
router.post("/createUser", createUser);

/**
 * @route POST /api/loginUser
 * @description Login an existing user
 * @access Public
 */
router.post("/loginUser", loginUser);

/**
 * @route GET /api/getUser
 * @description Get user information
 * @access Private
 */
router.get("/getUser", verifyToken, getUser);

// router.post("/createStore", createStore); //Not in use for now
// router.post("/createService/:storeId", createService); //Not in use for now
// router.post("/createCoupon/:storeId", createCoupon); //Not in use for now
// router.post("/createAccount", createAccount); //Not in use for now
// router.get("/getAccount", getAccount); //Not in use for now
router.get("/getStores", verifyToken, getStores);
// router.get("/getServices", getServices); //Not in use for now
// router.get("/getCoupons", getCoupons); //Not in use for now
// router.put("/redeemCoupon", redeemCoupon); //Not in use for now

/**
 * @route POST /api/createItem
 * @description Create a new item
 * @access Private
 */
router.post("/createItem", verifyToken, createItem);

/**
 * @route GET /api/getItems
 * @description Get all items
 * @access Public
 */
router.get("/getItems", getAllItems);

/**
 * @route POST /api/purchaseCoupon
 * @description Purchase a coupon
 * @access Private
 */
router.post("/purchaseCoupon", verifyToken, purchaseCoupon);

/**
 * @route POST /api/purchaseItem
 * @description Purchase an item
 * @access Private
 */
router.post("/purchaseItem", verifyToken, purchaseItem);

/**
 * @route GET /api/getUserBalance
 * @description Get user's balance
 * @access Private
 */
router.get("/getUserBalance", verifyToken, getUserBalance);

/**
 * @route POST /api/createCollection
 * @description Create a collection
 * @access Private
 */
router.post("/createCollection", verifyToken, createCollectionController);

/**
 * @route POST /api/transferToken
 * @description Transfer a token to another user
 * @access Private
 */
router.post("/transferToken", verifyToken, transferTokenController);

/**
 * @route POST /api/mintToken
 * @description Mint a new token
 * @access Private
 */
router.post("/mintToken", verifyToken, mintToken);

/**
 * @route GET /api/buyerPurchases
 * @description Get all purchases made by the buyer
 * @access Private
 */
router.get("/buyerPurchases", verifyToken, checkBuyerPurchases);

/**
 * @route GET /api/checkStorePurchases
 * @description Check purchases made in the store
 * @access Private
 */
router.get("/checkStorePurchases", verifyToken, checkStorePurchases);

/**
 * @route GET /api/getCollections
 * @description Get user's collections
 * @access Private
 */
router.get("/getCollections", verifyToken, getUserCollections);

/**
 * @route GET /api/getUserToken
 * @description Get user's tokens
 * @access Private
 */
router.get("/getUserToken", verifyToken, getUserToken);

/**
 * @route GET /api/getUserTokensAndPrizes
 * @description Get user's tokens and prizes
 * @access Private
 */
router.get("/getUserTokensAndPrizes", verifyToken, getUserTokensAndPrizes);

// /**
//  * @route GET /api/getStoreItems
//  * @description Get store items
//  * @access Private
//  */
router.get("/getStoreItems", verifyToken, getStoreItems);

// /**
//  * @route DELETE /api/burnToken
//  * @description Burn a token
//  * @access Private
//  */
// router.delete("/burnToken", verifyToken, burnToken);

/**
 * @route GET /api/getAllCoupons
 * @description Get all coupons
 * @access Private
 */
router.get("/getAllCoupons", getAllCoupons);

/**
 * get all my coupons
 * @route GET /api/getAllMyCoupons/:accountAddress
 * @description Get all coupons of a user
 */
// router.get("/getAllMyCoupons/:accountAddress", verifyToken, getAllMyCoupons);
router.get("/getAllMyCoupons", verifyToken, getAllMyCoupons);


/**
 * @route GET /api/getStoreCoupons/:accountAddress
 * @description Get store coupons
 * @access Private
 */
router.get("/getStoreCoupons/:accountAddress", verifyToken, getStoreCoupons);

/**
 * @route POST /api/initiateCouponSwap
 * @description Initiate a coupon swap
 * @access Private
 */
router.post("/initiateCouponSwap", verifyToken, initiateCouponSwap);

/**
 * @route POST /api/acceptCouponSwap
 * @description Accept a coupon swap
 * @access Private
 */
router.post("/acceptCouponSwap", verifyToken, acceptCouponSwap);

/**
 * @route POST /api/declineCouponSwap
 * @description Decline a coupon swap
 * @access Private
 */
router.post("/declineCouponSwap", verifyToken, declineCouponSwap);

/**
 * @route GET /api/getSwapOffers
 * @description Get all swap offers
 * @access Private
 */
router.get("/getSwapOffers", verifyToken, getSwapOffers);

/**
 * @route POST /api/mintSpecialToken
 * @description Mint a special token
 * @access Private
 */
router.post("/mintSpecialToken", verifyToken, createSpecialToken);

/**
 * @route POST /api/redeemCoupon
 * @description Redeem a coupon
 * @access Private
 */
router.post("/redeemCoupon", verifyToken, redeemCoupon);


router.get("/getAllRedeemRequests", verifyToken, getAllRedeemRequests);

/**
 * @route DELETE /api/acceptRedeemRequest/:redeemRequestId
 * @description Accept a redeem request
 * @access Private
 */
router.delete(
  "/acceptRedeemRequest/:redeemRequestId",
  verifyToken,
  acceptRedeemRequest
);

/**
 * @route POST /api/admin/wallet
 * @description Create a new admin wallet
 * @access Private
 */
// router.post("/admin/wallet", createAdminWallet);

// /**
//  * @route GET /api/admin/wallet
//  * @description Get admin wallet information
//  * @access Private
//  */
// router.get("/admin/wallet", getAdminWallet);

// /**
//  * @route PUT /api/admin/wallet
//  * @description Update admin wallet information
//  * @access Private
//  */
// router.put("/admin/wallet", updateAdminWallet);

/**
 * @route GET /api/getItemsByCategory/:category
 * @description Get items by category
 * @access Private
 */
router.get("/getItemsByCategory/:category", verifyToken, getItemsByCategory);

/**
 * @route GET /api/getLeaderboard
 * @description Get leaderboard
 * @access Private
 */
router.get("/getLeaderboard", getLeaderboard);

/**
 * @route POST /api/createUserWithPolkadot
 * @description Create a new user with Polkadot wallet
 * @access Public
 */
router.post("/createUserWithPolkadot", createUserWithPolkadot);

/**
 * @route POST /api/loginWithPolkadot
 * @description Sign in a user with Polkadot wallet
 * @access Public
 */
router.post("/loginWithPolkadot", loginWithPolkadot);

export default router;
