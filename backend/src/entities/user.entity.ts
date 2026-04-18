import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Chat } from "./chat.entity.js";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column({ type: "varchar", unique: true })
  clerk_id!: string;

  @Column({ unique: true, type: "varchar" })
  email!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Chat, (chat) => chat.user)
  chats!: Chat[];
}