import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { User } from 'src/users/users.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  type: string; // 'income' or 'expense'

  @Column()
  amount: number;

  @Column()
  categoryName: string;

  @Column()
  description: string;

  @ManyToOne(() => Category)
  category: Category;

  @ManyToOne(() => User)
  user: User;
}
