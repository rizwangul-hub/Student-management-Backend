import express, { Router } from "express";

const router = Router();
router.get("/profile", authMiddleware, getProfile);
router.post("/register", Register);
router.post("/login", Login);

export default router;
