import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "@src/auth/auth.entity";

export class DiaryItem {
  title: string;
  content: string;
}
export class DiaryDto {
  date: string;
  diaries: DiaryItem[];
}

@Entity("diary")
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  date: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @ManyToOne(() => User, (user) => user.diaries, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "user_id" })
  user: User;
}
