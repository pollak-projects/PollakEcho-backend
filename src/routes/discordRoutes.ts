import express, { Request, Response } from "express";
import {
  addPoints,
  linkDiscord,
  listTop10Users,
  removePoints,
} from "../controllers/discordController";

const router = express.Router();

router.post("/add-points", addPoints);
router.post("/remove-points", removePoints);
router.post("/om", linkDiscord as any);
router.get("/top", listTop10Users);

export default router;
