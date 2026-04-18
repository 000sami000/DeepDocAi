import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Chat } from "./chat.entity.js";



@Entity()
export class Chunk {
  @PrimaryGeneratedColumn()
  chunk_id!: number;

  @Column({ type: "text" })
  chunk_content!: string;

   @Column({ type: "varchar" })
  qdrant_point_id!: string;

  @ManyToOne(() => Chat, (chat) => chat.chunks,{ onDelete: "CASCADE" })
  chat!: Chat;
}