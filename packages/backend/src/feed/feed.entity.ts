import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("feeds")
export class Feed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  userId: string;

  @Column("text")
  content: string;

  @Column("text", { nullable: true })
  music: string;

  @Column("text", { nullable: true })
  mood: string;

  @Column("text", { nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column("simple-array", { default: [] })
  likes: string[];

  @Column("json", { default: [] })
  comments: { userId: string; text: string; createdAt: string }[];
}
