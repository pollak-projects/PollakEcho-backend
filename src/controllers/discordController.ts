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

    const [discordRows]: [IUser[], any] = await db.query(
      "SELECT * FROM users WHERE discordId = ?",
      [discordId]
    );

    if (discordRows.length > 0) {
      return res.status(400).json({
        message: "Ez a discord fiók már hozzá van kapcsolva egy fiókhoz",
      });
    }

    const [rows]: [RowDataPacket[], any] = await db.query(
      "SELECT * FROM users WHERE userId = ?",
      [userId]
    );

    if (rows.length === 1) {
      await db.query("UPDATE users SET discordId = ? WHERE userId = ?", [
        discordId,
        userId,
      ]);
    } else if (rows.length === 0) {
      await db.query("INSERT INTO users (userId, discordId) VALUES (?, ?)", [
        userId,
        discordId,
      ]);
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json({ message: "Sikeresen hozzá lett kapcsolva a fiók" });
  } catch (error) {
    console.error("Hiba történt", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const listTop10Users = async (req: Request, res: Response) => {
  //debug
  try {
    const [rows] = await db.query<IUser[]>(
      "SELECT * FROM users ORDER BY point DESC LIMIT 10"
    );
    console.log(rows);

    const topUsers = await Promise.all(
      rows.map(async (user) => {
        const apiUrl = "https://auth.pollak.info/user/get/" + user.userId;
        const apiResponse = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY || "",
          },
        });

        if (!apiResponse.ok) {
          throw new Error("Nem sikerült lekérni az adatokat");
        }

        const { name, om } = await apiResponse.json();
        return { ...user, name, om };
      })
    );
    console.log(topUsers);

    res.json(topUsers);
  } catch (error) {
    console.error("Hiba történt", error);
    res.status(500).json({ message: "Server error" });
  }
};
