import express, { Request, Response } from "express";
import {
  addPoints,
  linkDiscord,
  removePoints,
} from "../controllers/discordController";

const router = express.Router();

router.post("/add-points", addPoints);
router.post("/remove-points", removePoints);
router.post("/link-discord", linkDiscord as any);

export default router;
