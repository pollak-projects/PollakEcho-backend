import express from "express";
import {
  addPoints,
  removePoints,
  linkDiscord,
} from "../controllers/discordController";

const router = express.Router();

router.post("/add-points", addPoints);
router.post("/remove-points", removePoints);
router.post("/link-discord", linkDiscord);

export default router;
