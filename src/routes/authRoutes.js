import express, { Router } from "express";
import { Register, Login, getProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/profile", authMiddleware, getProfile);
router.post("/register", Register);
router.post("/login", Login);

export default router;
