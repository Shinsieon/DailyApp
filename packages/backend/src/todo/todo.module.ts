import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Todo } from "./todo.entity";
import { TodoService } from "./todo.service";
import { TodoController } from "./todo.controller";
import { User } from "src/auth/auth.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Todo, User])], // TypeORM 등록
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
