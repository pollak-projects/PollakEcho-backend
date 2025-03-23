import express from "express";
import {
  addPoints,
  linkDiscord,
  listTop10Users,
  removePoints,
  getUserMessages,
  addUserMessages,
} from "../controllers/discordController";
import { KeycloakMiddleware } from "../middleware/tokenMiddleware";

const router = express.Router();

router.post("/add-points", addPoints);
router.post("/remove-points", removePoints);
router.post("/om", linkDiscord as any);
router.get("/top", listTop10Users);
router.get("/msg/:discordId", getUserMessages as any);
router.post("/msg/:discordId", addUserMessages as any);
export default router;
