import express from "express";
import { verifyToken } from "../middleware/generateToken.js";
import { checkGameProgress, saveGameScore, updateGameProgress } from "../controllers/Game.js";
const gameRouter = express.Router();

gameRouter.get("/checkGameProgress", verifyToken, checkGameProgress);
gameRouter.post("/updateGameProgress", verifyToken, updateGameProgress);
gameRouter.post("/saveGameScore", verifyToken, saveGameScore);

export default gameRouter;
