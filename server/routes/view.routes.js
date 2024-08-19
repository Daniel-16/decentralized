import express from "express";
const router = express.Router();

router.get("/home", async function (req, res) {
  console.log(req.token);
  res.render("home", );
});

router.get("/register", async function (req, res) {
  res.render("auth/register");
});

router.get("/login", async function (req, res) {
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

export default router;
