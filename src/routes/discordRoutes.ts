import express from "express";
import {
  addPoints,
  linkDiscord,
  listTop10Users,
  removePoints,
  getUserMessages,
  addUserMessages
} from "../controllers/discordController";

const router = express.Router();

router.post("/add-points", addPoints);
router.post("/remove-points", removePoints);
router.post("/om", linkDiscord as any);
router.get("/top", listTop10Users);
router.get("/msg/:discordId", getUserMessages );
router.post("/msg/:discordId", addUserMessages );
export default router;
