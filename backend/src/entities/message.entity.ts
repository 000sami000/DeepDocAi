import "reflect-metadata";

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Chat } from "./chat.entity.js";



export enum MessageType {
  USER = "user",
  ASSISTANT = "assistant",
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  message_id!: string;

 @Column({
  type: "enum",
  enum: MessageType,
})
message_type!: MessageType;

  @Column({ type: "text" })
  message_text!: string;

  @ManyToOne(() => Chat, (chat) => chat.messages, {
  onDelete: "CASCADE", 
})
  chat!: Chat;

  @CreateDateColumn()
  createdAt!: Date;
}