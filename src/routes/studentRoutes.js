import express, { Router } from "express";
import {
  allStudents,
  deleteStudent,
  searchStudent,
  singleStudent,
  studentCreate,
  studentStats,
  updateStudent,
} from "../controllers/studentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();
// Specific routes FIRST
router.get("/students/stats", authMiddleware, studentStats);
router.get("/students/search", authMiddleware, searchStudent);
// General and dynamic routes AFTER
router.get("/students", authMiddleware, allStudents);
router.get("/students/:id", authMiddleware, singleStudent);
router.post("/students", authMiddleware, studentCreate);
router.put("/students/:id", authMiddleware, updateStudent);
router.delete("/students/:id", authMiddleware, deleteStudent);

export default router;
