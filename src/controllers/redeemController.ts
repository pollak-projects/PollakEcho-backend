//@ts-nocheck
import { Request, Response } from "express";
import db from "../utils/db";
import { IRedeem } from "../models/Redeem";
import { IReward } from "../models/Reward";
import { IUser } from "../models/Student";

export interface IuserRequest extends Request {
  userId?: string;
}

/* Rewards table
id
description
cost
*/

export const redeemReward = async (req: IuserRequest, res: Response) => {
  try {
    const { rewardId } = req.body;
    const [userRows] = await db.query<IUser[]>(
      "SELECT * FROM users WHERE id = ?",
      [req.userId]
    );
    const [rewardRows] = await db.query<IReward[]>(
      "SELECT * FROM rewards WHERE id = ?",
      [rewardId]
    );

    if (userRows.length === 0 || rewardRows.length === 0) {
      res.status(404).json({ message: "User or Reward not found" });
      return;
    }

    const user = userRows[0];
    const reward = rewardRows[0];

    if (user.point < reward.cost) {
      res.status(400).json({ message: "Not enough points" });
      return;
    }

    await db.query("INSERT INTO redeems (userId, rewardId) VALUES (?, ?)", [
      user.id,
      reward.id,
    ]);

    res.json({ message: "Redeem request submitted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateReedem = async (req: Request, res: Response) => {
  try {
    const { redeemId, status } = req.body;
    await db.query("UPDATE redeems SET status = ? WHERE id = ?", [
      status,
      redeemId,
    ]);

    res.json({ message: "Redeem updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getRedeems = async (req: IuserRequest, res: Response) => {
  try {
    const [rows] = await db.query<IRedeem[]>(
      "SELECT * FROM redeems WHERE userId = ?",
      [req.userId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllRedeems = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<IRedeem[]>("SELECT * FROM redeems");

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
