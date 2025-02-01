import { Budget } from "src/budget/budget.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity("category")
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  type: string;

  @Column("text")
  label: string;

  @Column({ length: 50 })
  value: string;

  @OneToMany(() => Budget, (budget) => budget.category)
  budgets: Budget[];
}
