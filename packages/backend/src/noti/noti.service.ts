import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Noti } from "./noti.entity";
import { User } from "@src/auth/auth.entity";
import e from "express";

@Injectable()
export class NotiService {
  constructor(
    @InjectRepository(Noti) private readonly notiRepository: Repository<Noti>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async createNoti(userId: number, deviceId: string): Promise<Noti> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const existedNoti = await this.getUserNoti(userId);
    if (existedNoti) {
      existedNoti.deviceId = deviceId;
      existedNoti.createdAt = new Date();
      existedNoti.deletedAt = null;
      return this.notiRepository.save(existedNoti);
    }
    const noti = this.notiRepository.create({ user, deviceId });
    return this.notiRepository.save(noti);
  }

  async deleteNoti(userId: number) {
    const noti = await this.getUserNoti(userId);
    if (!noti) throw new Error("Noti not found");

    return this.notiRepository.softRemove(noti);
  }

  async getUserNoti(userId: number): Promise<Noti> {
    // await this.userRepository
    //   .createQueryBuilder("user")
    //   .where("user.email = :email", { email })
    //   .withDeleted() // 👈 소프트 삭제된 유저도 포함
    //   .getOne();
    return this.notiRepository
      .createQueryBuilder("noti")
      .leftJoinAndSelect("noti.user", "user")
      .where("user.id = :userId", { userId })
      .withDeleted()
      .getOne();
  }
}
