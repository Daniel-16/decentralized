import express from "express";
const router = express.Router();

router.get("/home", async function (req, res) {
  res.render("home", );
});

router.get("/register", async function (req, res) {
  res.render("auth/register");
});

router.get("/login", async function (req, res) {
  res.render("auth/login");
});

export default router;
