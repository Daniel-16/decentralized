import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import "dotenv/config.js";
import router from "./routes/routes.js";

const app = express();
app.use(cors());

// Rate limit
app.use(express.json({ limit: "30mb" }));
app.use("/api", router);

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
