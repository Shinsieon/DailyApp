import { User } from "src/auth/auth.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";

@Entity("todos")
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "date" })
  date: string;

  @Column({ type: "boolean", default: false })
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // 👇 userId 추가 (기존 User와 연결)
  @ManyToOne(() => User, (user) => user.todos, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "user_id" })
  user: User;
}
