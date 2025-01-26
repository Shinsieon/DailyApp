import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
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
  value: string;
}
