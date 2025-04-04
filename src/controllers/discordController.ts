//@ts-nocheck
import { Request, Response } from "express";
import db from "../utils/db";
import { IUser } from "../models/Student";
// Update imports for PostgreSQL
import { QueryResult } from "pg";
import { TokenCache } from "../middleware/tokenMiddleware";

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
      'SELECT * FROM users WHERE "discordId" = $1;',
      [discordId]
    );
    const rows = result.rows;

    if (rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await db.query(
      'UPDATE users SET point = point + $1 WHERE "discordId" = $2;',
      [point, discordId]
    );

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
      'SELECT * FROM users WHERE "discordId" = $1',
      [discordId]
    );
    const rows = result.rows;

    if (rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    await db.query(
      'UPDATE users SET point = point - $1 WHERE "discordId" = $2;',
      [point, discordId]
    );

    res.json({
      message: "Points removed successfully",
      balance: rows[0].point - point,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const linkDiscord = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { om, discordId } = req.body;
    if (!om || !discordId) {
      return res.status(400).json({
        message: "OM és Discord ID megadása kötelező",
      });
    }

    const userId = await getUserIdFromOM(om);
    console.log("User ID from OM:", userId);
    const existingDiscordLink = await checkExistingDiscordLink(discordId);
    if (existingDiscordLink) {
      return res.status(409).json({
        message: "Ez a discord fiók már hozzá van kapcsolva egy fiókhoz",
      });
    }

    const userExists = await checkUserExists(userId);
    if (userExists) {
      return res.status(409).json({
        message: "A felhasználó már hozzá van kapcsolva egy discord fiókhoz",
      });
    }

    const userData = await getUserData(userId);

    await createUserDiscordLink(userId, discordId);
    console.log(userData);

    return res.status(200).json({
      message: "Sikeresen hozzá lett kapcsolva a fiók",
      content: userData,
    });
  } catch (error) {
    console.error("Hiba történt:", error);
    return res.status(500).json({ message: "Szerver hiba" });
  }
};

const getUserIdFromOM = async (om: string): Promise<string> => {
  const apiUrl = `${process.env.BACKEND_URL}/api/v1/users-data/om/${om}`;

  console.log("OM:", om);
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${TokenCache.getToken(process.env.CLIENT_ID!)}`,
    },
  });

  //debug
  console.log("API response:", response);
  console.log("API URL:", apiUrl);

  if (!response.ok) {
    throw new Error("Nem sikerült lekérni az adatokat az OM rendszerből");
  }

  return await response.text();
};

const checkExistingDiscordLink = async (
  discordId: string
): Promise<boolean> => {
  const result = await db.query('SELECT * FROM users WHERE "discordId" = $1', [
    discordId,
  ]);
  return result.rows.length > 0;
};

const checkUserExists = async (userId: string): Promise<boolean> => {
  const result = await db.query('SELECT * FROM users WHERE "userId" = $1', [
    userId,
  ]);
  return result.rows.length > 0;
};

const createUserDiscordLink = async (
  userId: string,
  discordId: string
): Promise<void> => {
  await db.query('INSERT INTO users ("userId", "discordId") VALUES ($1, $2)', [
    userId,
    discordId,
  ]);
};

const getUserData = async (userId: string): Promise<object> => {
  const apiUrl = `${process.env.BACKEND_URL}/api/v1/users-data/${userId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${TokenCache.getToken(process.env.CLIENT_ID!)}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API returned error status: ${response.status} ${response.statusText}`
      );
    }

    // Check if there's content
    const text = await response.text();
    if (!text) {
      console.log("Empty response received from API");
      return {};
    }

    // Try to parse the text as JSON
    try {
      const data = JSON.parse(text);
      console.log("User data retrieved:", data);
      return data;
    } catch (parseError) {
      console.error("Failed to parse JSON response:", text);
      throw new Error(`Invalid JSON response: ${parseError.message}`);
    }
  } catch (error) {
    console.error(`Error fetching user data for userId=${userId}:`, error);
    throw error;
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
        const apiUrl = `${process.env.BACKEND_URL}/api/v1/users-data/${user.userId}`;
        const apiResponse = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${TokenCache.getToken(process.env.CLIENT_ID!)}`,
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
      'SELECT * FROM messages WHERE "discordId" = $1;',
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
      'SELECT * FROM messages WHERE "discordId" = $1',
      [discordId]
    );
    const rows = result.rows;

    if (Array.isArray(rows) && rows.length > 0) {
      return res.status(400).json({ message: "Message already exists" });
    }

    await db.query(
      'INSERT INTO messages ("discordId", message) VALUES ($1, $2);',
      [discordId, message]
    );
    res.json({ message: "Message added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
