import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Todo } from "./todo.entity";
import { TodoService } from "./todo.service";
import { TodoController } from "./todo.controller";
import { User } from "src/auth/auth.entity";
import { Noti } from "@src/noti/noti.entity";
import { PushModule } from "@src/push/push.module";
import { TodoScheduler } from "./todo.scheduler";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo, User, Noti]),
    PushModule,
    ScheduleModule.forRoot(),
  ], // TypeORM 등록
  controllers: [TodoController],
  providers: [TodoService, TodoScheduler],
})
export class TodoModule {}
