import express from "express";
import { getBalance } from "../controllers/userController";

const router = express.Router();

router.get("/balance", getBalance);

export default router;
