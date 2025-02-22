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

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/discord", discordRoutes);
app.use("/redeem", redeemRoutes);

export default app;
