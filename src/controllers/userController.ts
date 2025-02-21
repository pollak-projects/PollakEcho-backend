import { Request, Response } from "express";
import db from "../utils/db";
import { IUser } from "../models/Student";

export interface IUserRequest extends Request {
  userId?: string;
}

export const getBalance = async (
  req: IUserRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const [rows] = await db.query<IUser[]>(
      "SELECT point FROM users WHERE userId = ?",
      [req.userId]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ balance: rows[0].balance });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
