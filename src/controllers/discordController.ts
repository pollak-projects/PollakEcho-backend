//@ts-nocheck
import { Request, Response } from "express";
import db from "../utils/db";
import { IUser } from "../models/Student";
// Update imports for PostgreSQL
import { QueryResult } from "pg";

interface IDiscordRequest {
  discordId: string;
  userId?: string;
  point?: number;
  message?: string;
}

export const addPoints = async (req: Request, res: Response) => {
  try {
    const { discordId, point } = req.body;
    const result = await db.query<IUser>(
      "SELECT * FROM users WHERE \"discordId\" = $1;",
      [discordId]
    );
    const rows = result.rows;
    
    if (rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await db.query("UPDATE users SET point = point + $1 WHERE \"discordId\" = $2;", [
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
    const result = await db.query<IUser>(
      "SELECT * FROM users WHERE \"discordId\" = $1",
      [discordId]
    );
    const rows = result.rows;
    
    if (rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    await db.query("UPDATE users SET point = point - $1 WHERE \"discordId\" = $2;", [
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
    console.log("Getting user id from OM", apiResponse);

    if (!apiResponse.ok) {
      throw new Error("Nem sikerült lekérni az adatokat az OM rendszerből");
    }

    const { id: userId } = await apiResponse.json();

    const discordResult = await db.query(
      "SELECT * FROM users WHERE \"discordId\" = $1",
      [discordId]
    );
    const discordRows = discordResult.rows;

    console.log(discordRows);

    if (discordRows.length > 0) {
      console.log("Ez a discord fiók már hozzá van kapcsolva egy fiókhoz");
      return res.status(400).json({
        message: "Ez a discord fiók már hozzá van kapcsolva egy fiókhoz",
      });
    }

    const userResult = await db.query(
      "SELECT * FROM users WHERE \"userId\" = $1",
      [userId]
    );
    const rows = userResult.rows;

    console.log(rows);

    if (rows.length === 1) {
      console.log("A felhasználó már hozzá van kapcsolva egy discord fiókhoz");
      return res.status(400).json({
        message: "A felhasználó már hozzá van kapcsolva egy discord fiókhoz",
      });
      
    } else if (rows.length === 0) {
      console.log("Nincs ilyen felhasználó az adatbázisban");
      await db.query("INSERT INTO users (\"userId\", \"discordId\") VALUES ($1, $2)", [
        userId,
        discordId,
      ]);

      const apiUrl2 = "https://auth.pollak.info/user/get/" + userId;
      const apiResponse2 = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY || "",
        },
      });
    } else {
      console.log("Több mint egy felhasználó van az adatbázisban");
      return res.status(500).json({ message: "Internal server error" });
    }

    res
      .status(200)
      .json({
        message: "Sikeresen hozzá lett kapcsolva a fiók",
        content: apiResponse2.json(),
      });
  } catch (error) {
    console.error("Hiba történt", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const listTop10Users = async (req: Request, res: Response) => {
  try {
    const result = await db.query(
      "SELECT * FROM v_users ORDER BY point DESC LIMIT 10"
    );
    const rows = result.rows;
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

        const data = await apiResponse.json();

        console.log(data);
        return { ...user, name: data.nev };
      })
    );
    console.log(topUsers);

    res.json(topUsers);
  } catch (error) {
    console.error("Hiba történt", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserMessages = async (req: Request, res: Response) => {
  try {
    const { discordId } = req.params;
    console.log(discordId);
    const result = await db.query(
      "SELECT * FROM messages WHERE \"discordId\" = $1;",
      [discordId]
    );
    const rows = result.rows;

    if (rows.length === 0) {
      return res.status(404).json({ message: "User has no messages" });
    }

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addUserMessages = async (req: Request, res: Response) => {
  try {
    const { discordId } = req.params;
    const { message } = req.body;

    const result = await db.query(
      "SELECT * FROM messages WHERE \"discordId\" = $1",
      [discordId]
    );
    const rows = result.rows;

    if (Array.isArray(rows) && rows.length > 0) {
      return res.status(400).json({ message: "Message already exists" });
    }

    await db.query("INSERT INTO messages (\"discordId\", message) VALUES ($1, $2);", [
      discordId,
      message,
    ]);
    res.json({ message: "Message added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
