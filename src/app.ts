import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import studentRoutes from "./routes/studentRoutes";
import adminRoutes from "./routes/adminRoutes";
import discordRoutes from "./routes/discordRoutes";
import redeemRoutes from "./routes/redeemRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/discord", discordRoutes);
app.use("/api/redeem", redeemRoutes);

export default app;
