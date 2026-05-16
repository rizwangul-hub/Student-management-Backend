import express from "express";
import { config } from "dotenv";
import { connnectionDB } from "./src/config/db.js";
import authRouter from "./src/routes/authRoutes.js";
import studentRouter from "./src/routes/studentRoutes.js";
import cors from "cors";

config();
const app = express();
app.use(express.json());
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://student-management-frontend-eta-three.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Connect to database
connnectionDB();

app.use("/api/auth", authRouter);
app.use("/api", studentRouter);

app.get("/", (req, res) => {
  res.send("welcome");
});

// Conditionally listen if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(7000, () => {
    console.log("Server running at http://localhost:7000");
  });
}

export default app;
