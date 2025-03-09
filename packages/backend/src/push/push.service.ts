import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Push } from "./push.entity";
import admin from "./firebase";
import { Noti } from "@src/noti/noti.entity";

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);

  constructor(
    @InjectRepository(Push)
    private pushRepository: Repository<Push>,

    @InjectRepository(Noti)
    private notiRepository: Repository<Noti>
  ) {}

  // 🔹 푸시 알림 보내기
  async sendPushNotification(userId: number, title: string, body: string) {
    console.log(userId, title, body);
    const noti = await this.notiRepository.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });
    if (!noti) {
      this.logger.error(`❌ User ${userId} deviceId not found`);
      throw new NotFoundException(`User ${userId} deviceId not found`);
    }
    console.log(noti);

    const message = {
      token: noti.deviceId,
      data: { type: "TODO_REMINDER" }, // 추가 데이터 전달 가능
      notification: { title, body },
    };

    try {
      const response = await admin.messaging().send(message);
      this.logger.log(`✅ Push Notification sent: ${response}`);

      // 🔹 푸시 알림을 DB에 저장
      await this.pushRepository.save({
        user: noti.user,
        deviceId: noti.deviceId,
        title,
        body,
      });
    } catch (error) {
      this.logger.error(`❌ Push Notification Error: ${error.message}`);
      throw new Error(`Push Notification Error: ${error.message}`);
    }
  }
}
