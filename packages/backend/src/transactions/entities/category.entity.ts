import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ synchronize: false })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;
}
