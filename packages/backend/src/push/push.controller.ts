import { Controller, Post, Body, Param } from "@nestjs/common";
import { PushService } from "./push.service";

@Controller("push")
export class PushController {
  constructor(private readonly pushService: PushService) {}

  // 🔹 특정 사용자에게 푸시 알림 보내기 (POST /push/send/:userId)
  @Post("send/:userId")
  async sendPush(
    @Param("userId") userId: number,
    @Body() { title, body }: { title: string; body: string }
  ) {
    await this.pushService.sendPushNotification(userId, title, body);
    return { message: `Push notification sent to user ${userId}` };
  }
}
