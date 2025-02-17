import { Request, Response } from "express";
import db from "../utils/db";
import { IStudent } from "../models/Student";
import { IRedeem } from "../models/Redeem";
import { IReward } from "../models/Reward";

export interface IStudentRequest extends Request {
  userId?: string;
}
export const redeemReward = async (req: IStudentRequest, res: Response) => {
  try {
    const { rewardId } = req.body;
    const [studentRows] = await db.query<IStudent[]>(
      "SELECT * FROM students WHERE id = ?",
      [req.userId]
    );
    const [rewardRows] = await db.query<IReward[]>(
      "SELECT * FROM rewards WHERE id = ?",
      [rewardId]
    );

    if (studentRows.length === 0 || rewardRows.length === 0) {
      res.status(404).json({ message: "Student or Reward not found" });
      return;
    }

    const student = studentRows[0];
    const reward = rewardRows[0];

    if (student.balance < reward.cost) {
      res.status(400).json({ message: "Not enough points" });
      return;
    }

    await db.query(
      "INSERT INTO redeems (studentId, rewardId, status) VALUES (?, ?, ?)",
      [student.id, reward.id, "pending"]
    );

    res.json({ message: "Redeem request submitted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const approveRedeem = async (req: Request, res: Response) => {
  try {
    const { redeemId } = req.body;
    const [redeemRows] = await db.query<IRedeem[]>(
      "SELECT * FROM redeems WHERE id = ?",
      [redeemId]
    );

    if (redeemRows.length === 0) {
      res.status(404).json({ message: "Redeem not found" });
      return;
    }

    const redeem = redeemRows[0];
    const [studentRows] = await db.query<IStudent[]>(
      "SELECT * FROM students WHERE id = ?",
      [redeem.studentId]
    );
    const [rewardRows] = await db.query<IReward[]>(
      "SELECT * FROM rewards WHERE id = ?",
      [redeem.rewardId]
    );

    if (studentRows.length === 0 || rewardRows.length === 0) {
      res.status(404).json({ message: "Student or Reward not found" });
      return;
    }

    const student = studentRows[0];
    const reward = rewardRows[0];

    if (student.balance < reward.cost) {
      res.status(400).json({ message: "Not enough points" });
      return;
    }

    await db.query("UPDATE students SET balance = balance - ? WHERE id = ?", [
      reward.cost,
      student.id,
    ]);
    await db.query("UPDATE redeems SET status = ? WHERE id = ?", [
      "approved",
      redeem.id,
    ]);

    res.json({ message: "Redeem approved" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
