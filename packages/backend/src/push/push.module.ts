import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Push } from "./push.entity";
import { PushService } from "./push.service";
import { PushController } from "./push.controller";
import { Noti } from "@src/noti/noti.entity";
import { User } from "@src/auth/auth.entity";
import { FirebaseAdmin } from "./firebase.service";

@Module({
  imports: [TypeOrmModule.forFeature([Push, Noti, User])],
  controllers: [PushController],
  providers: [PushService, FirebaseAdmin],
  exports: [PushService], // 다른 모듈에서 사용할 수 있도록 내보내기
})
export class PushModule {}
