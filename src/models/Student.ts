import { RowDataPacket } from "mysql2";

export interface IStudent extends RowDataPacket {
  id: number;
  discordId: string;
  balance: number;
  dailyCheckIn: Date;
}
