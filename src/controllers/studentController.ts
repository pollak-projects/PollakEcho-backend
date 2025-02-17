import { Request, Response } from "express";
import db from "../utils/db";
import { IStudent } from "../models/Student";

export interface IStudentRequest extends Request {
  userId?: string;
}

export const getBalance = async (
  req: IStudentRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const [rows] = await db.query<IStudent[]>(
      "SELECT balance FROM students WHERE id = ?",
      [req.userId]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "Student not found" });
      return;
    }
    res.json({ balance: rows[0].balance });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const dailyCheckIn = async (
  req: IStudentRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const [rows] = await db.query<IStudent[]>(
      "SELECT * FROM students WHERE id = ?",
      [req.userId]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    const student = rows[0];
    const today = new Date();

    if (
      student.dailyCheckIn &&
      new Date(student.dailyCheckIn).toDateString() === today.toDateString()
    ) {
      res.status(400).json({ message: "Already checked in today" });
      return;
    }

    await db.query(
      "UPDATE students SET balance = balance + 10, dailyCheckIn = ? WHERE id = ?",
      [today, req.userId]
    );

    res.json({
      message: "Checked in successfully",
      balance: student.balance + 10,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
