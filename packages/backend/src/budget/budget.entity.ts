import { User } from "src/auth/auth.entity";
import { Category } from "src/category/category.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

export enum BudgetType {
  INCOME = "income",
  EXPENSE = "expense",
}

@Entity("budgets")
export class Budget {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "date" })
  date: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({ type: "enum", enum: BudgetType })
  type: BudgetType;

  @Column({ type: "text", nullable: true })
  other?: string;

  // 👇 userId 추가 (기존 User와 연결)
  @ManyToOne(() => User, (user) => user.budgets, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Category, (category) => category.budgets, {
    nullable: false,
  })
  @JoinColumn({ name: "category_id" })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;
}
