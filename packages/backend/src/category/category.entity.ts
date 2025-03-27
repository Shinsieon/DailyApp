import { User } from "@src/auth/auth.entity";
import { Budget } from "src/budget/budget.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity("category")
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  type: string;

  @Column("text")
  label: string;

  @Column({ length: 50 })
  value: string | null;

  @OneToMany(() => Budget, (budget) => budget.category)
  budgets: Budget[];

  @ManyToOne(() => User, (user) => user.categories, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User | null;
}
