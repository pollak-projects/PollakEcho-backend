import express from "express";
import { redeemReward, approveRedeem } from "../controllers/redeemController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = express.Router();

router.post("/redeem", authMiddleware, redeemReward);
router.post("/approve", authMiddleware, adminMiddleware, approveRedeem);

export default router;
