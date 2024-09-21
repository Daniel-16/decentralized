import express from "express";
import { redirectIfAuthenticated } from "../middleware/redirectIfAuthenticated.js";
const router = express.Router();

router.get("/", async function (req, res) {
  console.log(req.token);
  res.render("home",);
});

router.get("/register", redirectIfAuthenticated, async function (req, res) {
  res.render("auth/register");
});

router.get("/login", redirectIfAuthenticated, async function (req, res) {
  res.render("auth/login");
});

// for items
// create items
router.get("/item/create", async function (req, res) {
  res.render("items/create_item");
});

// shop/purchase items
router.get("/shop", async function (req, res) {
  res.render("items/shop");
});

// for transactions
// view transactions
router.get("/transactions", async function (req, res) {
  res.render("transactions/my_transactions");
});


// my store - view my store and items purchased
router.get("/my-store", async function (req, res) {
  res.render("transactions/my_store_transactions");
});


// collection, mint
// create collection
router.get("/collection/create", async function (req, res) {
  res.render("collection/create_collection");
});

// tranfer token
// router.get("/token/transfer", async function (req, res) {
//   res.render("collection/tokens/transfer_token");
// });

// all tokens
router.get("/tokens", async function (req, res) {
  res.render("collection/tokens/all_tokens");
});



export default router;
