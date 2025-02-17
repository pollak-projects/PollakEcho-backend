import { Request, Response } from "express";
import db from "../utils/db";
import { IStudent } from "../models/Student";

export const addPoints = async (req: Request, res: Response) => {
  try {
    const { discordId, points } = req.body;
    const [rows] = await db.query<IStudent[]>(
      "SELECT * FROM students WHERE discordId = ?",
      [discordId]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    await db.query(
      "UPDATE students SET balance = balance + ? WHERE discordId = ?",
      [points, discordId]
    );

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
    const { discordId, points } = req.body;
    const [rows] = await db.query<IStudent[]>(
      "SELECT * FROM students WHERE discordId = ?",
      [discordId]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    await db.query(
      "UPDATE students SET balance = balance - ? WHERE discordId = ?",
      [points, discordId]
    );

    res.json({
      message: "Points removed successfully",
      balance: rows[0].balance - points,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    return;
  }
};
