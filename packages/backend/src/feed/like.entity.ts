import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Feed } from "../feed/feed.entity";
import { User } from "@src/auth/auth.entity";

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Feed, (feed) => feed.likes)
  feed: Feed;
}
