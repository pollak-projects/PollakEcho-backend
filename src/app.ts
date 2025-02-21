import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes";
import discordRoutes from "./routes/discordRoutes";
import redeemRoutes from "./routes/redeemRoutes";
import userRoutes from "./routes/userRoutes";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/discord", discordRoutes);
app.use("/api/redeem", redeemRoutes);

export default app;
