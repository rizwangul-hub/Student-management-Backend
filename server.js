import express from "express";
import { config } from "dotenv";
import { connnectionDB } from "./src/config/db.js";
import authRouter from "./src/routes/authRoutes.js";
import studentRouter from "./src/routes/studentRoutes.js";
import cors from "cors";

config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

// Connect to database first, then start server
connnectionDB()
  .then(() => {
    app.use("/api/auth", authRouter);
    app.use("/api", studentRouter);

    app.get("/", (req, res) => {
      res.send("welcome");
    });

    app.listen(7000, () => {
      console.log("Server running at http://localhost:7000");
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
