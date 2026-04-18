import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity.js";
import { Message } from "../entities/message.entity.js";
import { Chunk } from "../entities/chunk.entity.js";
import { Chat } from "../entities/chat.entity.js";
import * as dotenv from "dotenv";

dotenv.config();

let dataSource: DataSource;

export const getDataSource = async (): Promise<DataSource> => {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false, 
    entities: [User, Chat, Message, Chunk],
  });

  await dataSource.initialize();
  console.log("DataSource initialized");

  return dataSource;
};