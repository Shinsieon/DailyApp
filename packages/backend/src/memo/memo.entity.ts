import { User } from "src/auth/auth.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";

@Entity("memos")
export class Memo {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  group_name: string;

  @Column({ nullable: false })
  title: string;

  @Column({ type: "text", nullable: false })
  content: string;

  @Column({ type: "date" })
  date: string;

  @Column({ default: false })
  favorite: boolean;

  @Column({ default: false })
  secret: boolean;

  @Column({ default: 0 })
  showCount: number;

  // 🔹 User 테이블과 연결 (ManyToOne)
  @ManyToOne(() => User, (user) => user.memos, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
