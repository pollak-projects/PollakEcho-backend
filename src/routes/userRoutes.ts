import express from "express";
import { getBalance } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/balance", authMiddleware, getBalance);

export default router;
