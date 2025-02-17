import { adminMiddleware } from "./../middleware/adminMiddleware";
import express from "express";
import { addPoints, removePoints } from "../controllers/adminController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/add-points", authMiddleware, adminMiddleware, addPoints);
router.post("/remove-points", authMiddleware, adminMiddleware, removePoints);

export default router;
