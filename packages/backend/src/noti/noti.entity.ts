import { User } from "@src/auth/auth.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("noti")
export class Noti {
  @PrimaryGeneratedColumn()
  id: number;

  // 👇 userId 추가 (기존 User와 연결)
  @OneToOne(() => User, (user) => user.noti, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "user_id" })
  user: User;
  @Column({ type: "varchar", length: 255 })
  deviceId: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date; // 소프트 삭제를 위한 필드
}
