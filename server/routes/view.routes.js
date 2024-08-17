import express from "express";
const router = express.Router();

router.get("/home", async function (req, res) {
  res.render("home");
});

export default router;
