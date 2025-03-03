import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import "dotenv/config.js";
import router from "./routes/routes.js";
import viewRouter from "./routes/view.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import "./utils/scheduler.js";
import "./utils/scheduleWinningUser.js";
import "./utils/logHighPointUsers.js";
import gameRouter from "./routes/game.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// view engine to ejs
app.set("views", path.join(__dirname, "../frontend2/views"));
app.set("view engine", "ejs");

// render static files from the public folder
app.use(express.static(path.join(__dirname, "../frontend2/public")));

// Rate limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// api routes
app.use("/api", router);
app.use("/api/game", gameRouter);

// view routes
app.use("/", viewRouter);

const port = process.env.PORT || 5500;
try {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server connected on port ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}

export default app;
