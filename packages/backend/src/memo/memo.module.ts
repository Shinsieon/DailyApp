import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Memo } from "./memo.entity";
import { MemoController } from "./memo.controller";
import { MemoService } from "./memo.service";
import { User } from "src/auth/auth.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Memo, User])],
  controllers: [MemoController],
  providers: [MemoService],
})
export class MemoModule {}
