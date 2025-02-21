import { Request, Response } from "express";
import db from "../utils/db";
import { IUser } from "../models/Student";

export const addPoints = async (req: Request, res: Response) => {
  try {
    const { discordId, point } = req.body;
    const [rows] = await db.query<IUser[]>(
      "SELECT * FROM users WHERE discordId = ?",
      [discordId]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await db.query("UPDATE users SET point = point + ? WHERE discordId = ?", [
      point,
      discordId,
    ]);

    res.json({
      message: "Points added successfully",
      balance: rows[0].point + point,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removePoints = async (req: Request, res: Response) => {
  try {
    const { discordId, point } = req.body;
    const [rows] = await db.query<IUser[]>(
      "SELECT * FROM users WHERE discordId = ?",
      [discordId]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    await db.query("UPDATE users SET point = point - ? WHERE discordId = ?", [
      point,
      discordId,
    ]);

    res.json({
      message: "Points removed successfully",
      balance: rows[0].point - point,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const linkDiscord = async (req: Request, res: Response) => {
  try {
    const { userId, discordId } = req.body;
    const [rows] = await db.query<IUser[]>(
      "SELECT * FROM users WHERE userId = ?",
      [userId]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (rows[0].discordId) {
      res
        .status(400)
        .json({ message: "The user already has a discord account linked" });
      return;
    }
    const [rows2] = await db.query<IUser[]>(
      "SELECT * FROM users WHERE discordId = ?",
      [discordId]
    );
    if (rows2.length > 0) {
      res.status(400).json({ message: "Discord account already linked" });
      return;
    }

    await db.query("UPDATE users SET discordId = ? WHERE userId = ?", [
      discordId,
      userId,
    ]);

    res.json({
      message: "Discord account linked successfully",
      discordId: discordId,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
