import express from "express";
import { getBalance, dailyCheckIn } from "../controllers/studentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/balance", authMiddleware, getBalance);
router.post("/daily-check-in", authMiddleware, dailyCheckIn);

export default router;
