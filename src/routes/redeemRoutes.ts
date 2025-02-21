import express from "express";
import {
  redeemReward,
  getRedeems,
  getAllRedeems,
  updateReedem,
} from "../controllers/redeemController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = express.Router();

router.post("/redeem", authMiddleware, redeemReward);
router.get("/redeems", authMiddleware, getRedeems);
router.get("/redeems/all", adminMiddleware, getAllRedeems);
router.put("/redeem", adminMiddleware, updateReedem);

export default router;
