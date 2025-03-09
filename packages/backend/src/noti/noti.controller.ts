import { Controller, Post, Body, Param, Delete, Get } from "@nestjs/common";
import { NotiService } from "./noti.service";

@Controller("noti")
export class NotiController {
  constructor(private readonly notiService: NotiService) {}

  @Post()
  async createNoti(
    @Body("userId") userId: number,
    @Body("deviceId") deviceId: string
  ) {
    return this.notiService.createNoti(userId, deviceId);
  }

  @Delete(":userId")
  async deleteNoti(@Param("userId") userId: number) {
    return this.notiService.deleteNoti(userId);
  }

  @Get(":userId")
  async getUserNoti(@Param("userId") userId: number) {
    return this.notiService.getUserNoti(+userId);
  }
}
