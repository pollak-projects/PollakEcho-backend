import { Request, Response } from "express";
import db from "../utils/db";
import { IUser } from "../models/Student";
import { RowDataPacket } from "mysql2";
interface IDiscordRequest {
  discordId: string;
  userId: string;
}

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
    const { om, discordId } = req.body;

    const apiUrl = "https://auth.pollak.info/user/getUserIdByOm/" + om;
    const apiResponse = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY || "",
      },
    });

    if (!apiResponse.ok) {
      throw new Error("Nem sikerült lekérni az adatokat az OM rendszerből");
    }

    const { id: userId } = await apiResponse.json();

    console.log(userId);
    console.log(discordId);

    res.status(200).json({
      message: {
        discordId: discordId,
        userId: userId,
      },
    });

    const [discordRows]: [IUser[], any] = await db.query(
      "SELECT * FROM users WHERE discordId = ?",
      [discordId]
    );

    console.log(discordRows);

    if (discordRows.length > 0) {
      return res.status(400).json({
        message: "Ez a discord fiók már hozzá van kapcsolva egy fiókhoz",
      });
    }

    await db.query("UPDATE users SET discordId = ? WHERE userId = ?", [
      discordId,
      userId,
    ]);

    res.status(200).json({ message: "Sikeresen összekapcsolva" });
  } catch (error) {
    console.error("Hiba történt", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
