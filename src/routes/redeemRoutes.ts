import express from "express";
import {
  redeemReward,
  getRedeems,
  getAllRedeems,
  updateReedem,
} from "../controllers/redeemController";
const router = express.Router();

router.post("/redeem", redeemReward);
router.get("/redeems", getRedeems);
router.get("/redeems/all", getAllRedeems);
router.put("/redeem", updateReedem);

export default router;
