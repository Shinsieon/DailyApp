import { Category } from "@src/category/category.entity";
import { Diary } from "@src/diary/diary.entity";
import { Feed } from "@src/feed/feed.entity";
import { Noti } from "@src/noti/noti.entity";
import { Push } from "@src/push/push.entity";
import { Budget } from "src/budget/budget.entity";
import { Memo } from "src/memo/memo.entity";
import { Todo } from "src/todo/todo.entity";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  OneToOne,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: "" })
  nickname: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ default: false })
  is_superuser: boolean;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];

  // 🔹 Budget 테이블과 1:N 관계 설정
  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];

  @OneToMany(() => Memo, (memo) => memo.user)
  memos: Memo[];

  @OneToMany(() => Push, (push) => push.user)
  pushes: Push[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Feed, (feed) => feed.user)
  feeds: Feed[];

  @OneToMany(() => Diary, (diary) => diary.user)
  diaries: Diary[];

  @OneToOne(() => Noti, (noti) => noti.user)
  noti: Noti;
}
