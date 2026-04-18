import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity.js";
import { Message } from "./message.entity.js";
import { Chunk } from "./chunk.entity.js";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn("uuid")
  chat_id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "boolean", default: false })
  isDeleted!: boolean;

  @Column({ type: "int" })
  user_id!: number;

  @ManyToOne(() => User, (user) => user.chats, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Message, (message) => message.chat)
  messages!: Message[];

  @OneToMany(() => Chunk, (chunk) => chunk.chat)
  chunks!: Chunk[];
}
