import { User } from "@src/auth/auth.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Like } from "./like.entity";
import { Comment } from "./comment.entity";

type FeedCategory = "음악" | "책" | "에피소드" | "여행" | "기타";

@Entity("feeds")
export class Feed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "enum", enum: ["음악", "책", "에피소드", "여행", "기타"] })
  category: FeedCategory;

  @Column("text")
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.feeds, { eager: true })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.feed, { cascade: true })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.feed, { cascade: true })
  likes: Like[];
}
