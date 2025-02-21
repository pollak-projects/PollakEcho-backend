import { Request, Response } from "express";
import db from "../utils/db";
import { IUser } from "../models/Student";

export const addPoints = async (req: Request, res: Response) => {
  try {
    const { userId, points } = req.body;
    const [rows] = await db.query<IUser[]>(
      "SELECT * FROM users WHERE userId = ?",
      [userId]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await db.query("UPDATE users SET point = point + ? WHERE userId = ?", [
      points,
      userId,
    ]);

    res.json({
      message: "Points added successfully",
      balance: rows[0].balance + points,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removePoints = async (req: Request, res: Response) => {
  try {
    const { userId, point } = req.body;
    const [rows] = await db.query<IUser[]>(
      "SELECT * FROM users WHERE userId = ?",
      [userId]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    await db.query("UPDATE users SET point = point - ? WHERE userId = ?", [
      point,
      userId,
    ]);

    res.json({
      message: "Points removed successfully",
      balance: rows[0].point - point,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getPoints = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const [rows] = await db.query<IUser[]>(
      "SELECT * FROM users WHERE userId = ?",
      [userId]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ balance: rows[0].point });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
