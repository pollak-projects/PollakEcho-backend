import { RowDataPacket } from "mysql2";

export interface IRedeem extends RowDataPacket {
  id: number;
  userId: number;
  rewardId: number;
  status: "pending" | "approved" | "rejected";
}
