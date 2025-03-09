import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotiService } from "./noti.service";
import { NotiController } from "./noti.controller";
import { Noti } from "./noti.entity";
import { User } from "@src/auth/auth.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Noti, User])],
  providers: [NotiService],
  controllers: [NotiController],
  exports: [NotiService],
})
export class NotiModule {}
