import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiaryService } from "./diary.service";
import { DiaryController } from "./diary.controller";
import { Diary } from "./diary.entity";
import { User } from "@src/auth/auth.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Diary, User])],
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}
