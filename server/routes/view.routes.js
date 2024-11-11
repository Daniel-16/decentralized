import express from "express";
import { redirectIfNotAuthenticated } from "../middleware/redirectIfNotAuthenticated.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { getCoupon, getItem, getStoreCoupons, initiateCouponSwap } from "../controllers/MarketPlace.js";
import { getDashboard } from "../controllers/UserController.js";
import TokenModel from "../models/TokenModel.js";
const router = express.Router();

router.use(checkAuth);

router.get("/", async function (req, res) {
  res.render("home");
});

router.get("/register", async function (req, res) {
  res.render("auth/register");
});

router.get("/login", async function (req, res) {
  res.render("auth/login");
});

// for items
// create items
// router.get("/item/create", async function (req, res) {
//   res.render("items/create_item");
// });

// shop/purchase items
router.get("/shop/nft-marketplace", async function (req, res) {
  res.render("items/marketplace");
});

router.get("/shop/items", async function (req, res) {
  res.render("items/shop");
});

// get by category
// get items by category
router.get("/shop/items/category/:category", async function (req, res) {
  const category = req.params.category;
  const items = await TokenModel.find({ category: category });
  console.log(items);
  res.render("items/shop_by_category", { category, items });
});


// my store items
router.get("/my-store-items", async function (req, res) {
  res.render("admin/items/my_store_items");
});

// for transactions
// view transactions -frontend1
// router.get("/transactions", async function (req, res) {
//   res.render("transactions/my_transactions");
// });

// my store - view my store and items purchased
// router.get("/my-store", async function (req, res) {
//   res.render("transactions/my_store_transactions");
// });

// collection, mint
// create collection
router.get("/collection/create", async function (req, res) {
  res.render("collection/create_collection");
});

router.get("/collection/my-collections", async function (req, res) {
  res.render("collection/my-collections");
});

// tranfer token
// router.get("/token/transfer", async function (req, res) {
//   res.render("collection/tokens/transfer_token");
// });

// all tokens
router.get("/tokens", async function (req, res) {
  res.render("collection/tokens/all_tokens");
});

// admin panel
router.get("/my-store", async function (req, res) {
  res.render("admin/transactions/my_store_transactions");
});

router.get("/items/create", async function (req, res) {
  res.render("admin/items/create_item");
});

// router.get("/dashboard", getDashboard);

router.get("/dashboard", async function (req, res) {
  res.render("admin/dashboard-main");
});


router.get("/my-wallet", async function (req, res) {
  res.render("admin/wallet");
});

router.get("/transactions", async function (req, res) {
  res.render("admin/transactions/my_transactions");
});

router.get("/store/:accountAddress", async function (req, res) {
  res.render("store/store-coupon");
});


/**
 * @route GET /api/getCoupon/:collectionId/:tokenId
 * @description Get a single coupon
 * @access Private
 */
router.get("/getCoupon/:collectionId/:tokenId", getCoupon);

// add jwt check so i can get current logged in user
router.get("/getItem/:collectionId/:tokenId", getItem);


router.get("/initiate-coupon-swap", initiateCouponSwap);

router.get("/leaderboard", async function (req, res) {
  res.render("extras/leaderboard");
});



export default router;
