import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes";
import discordRoutes from "./routes/discordRoutes";
import redeemRoutes from "./routes/redeemRoutes";
import userRoutes from "./routes/userRoutes";
import { keyMiddleware } from "./middleware/keyMiddleware";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", keyMiddleware, userRoutes);
app.use("/admin", keyMiddleware, adminRoutes);
app.use("/discord", keyMiddleware, discordRoutes);
app.use("/redeem", keyMiddleware, redeemRoutes);

export default app;
