import { RowDataPacket } from "mysql2";

export interface IReward extends RowDataPacket {
  id: number;
  name: string;
  cost: number;
}
