import express from "express";
import { addPoints, removePoints } from "../controllers/discordController";

const router = express.Router();

router.post("/add-points", addPoints);
router.post("/remove-points", removePoints);

export default router;
