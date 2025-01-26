import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("patch_notes")
export class PatchNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  title: string;

  @Column("text")
  description: string;

  @Column({ length: 50 })
  version: string;

  @CreateDateColumn()
  createdAt: Date;
}
