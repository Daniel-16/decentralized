import express from "express";
import { redirectIfNotAuthenticated } from "../middleware/redirectIfNotAuthenticated.js";
const router = express.Router();

router.get("/", async function (req, res) {
  res.render("home",);
});

router.get("/register", redirectIfNotAuthenticated, async function (req, res) {
  res.render("auth/register");
});

router.get("/login", redirectIfNotAuthenticated, async function (req, res) {
  res.render("auth/login");
});

// for items
// create items
// router.get("/item/create", async function (req, res) {
//   res.render("items/create_item");
// });

// shop/purchase items
router.get("/shop", async function (req, res) {
  res.render("items/shop");
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
router.get("/collection/create", redirectIfNotAuthenticated, async function (req, res) {
  res.render("collection/create_collection");
});


router.get("/collection/my-collections", redirectIfNotAuthenticated, async function (req, res) {
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
router.get("/my-store", redirectIfNotAuthenticated, async function (req, res) {
  res.render("admin/transactions/my_store_transactions");
});


router.get("/items/create", redirectIfNotAuthenticated, async function (req, res) {
  res.render("admin/items/create_item");
});



router.get("/dashboard", redirectIfNotAuthenticated, async function (req, res) {
  res.render("admin/dashboard-main");
});


router.get("/my-wallet", redirectIfNotAuthenticated, async function (req, res) {
  res.render("admin/wallet");
});


router.get("/transactions", async function (req, res) {
  res.render("admin/transactions/my_transactions");
}); 

export default router;
