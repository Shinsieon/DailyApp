import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from "@nestjs/common";
import { TodoService } from "./todo.service";
import { Todo } from "./todo.entity";

@Controller("todos")
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // 🔹 1. 특정 사용자의 모든 할 일 조회 (GET /todos/user/:userId)
  @Get(":userId")
  async getUserTodos(
    @Param("userId", ParseIntPipe) userId: number
  ): Promise<Todo[]> {
    return this.todoService.getUserTodos(userId);
  }

  // 🔹 2. 특정 사용자의 특정 할 일 조회 (GET /todos/:userId/:todoId)
  @Get(":userId/:todoId")
  async getTodoById(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("todoId", ParseIntPipe) todoId: number
  ): Promise<Todo> {
    return this.todoService.getTodoById(userId, todoId);
  }

  // 🔹 3. 특정 사용자의 할 일 추가 (POST /todos/:userId)
  @Post(":userId")
  async createTodo(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() data: Partial<Todo>
  ): Promise<Todo> {
    return this.todoService.createTodo(userId, data);
  }

  // 3-1. 특정 사용자의 여러 할 일 한번에 추가 (POST /todos/multiple/:userId)
  @Post("multiple/:userId")
  async createMultipleTodos(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() data: any
  ): Promise<Todo[]> {
    return this.todoService.createMultipleTodos(userId, data.todos);
  }

  // 🔹 4. 특정 사용자의 할 일 수정 (PATCH /todos/:userId/:todoId)
  @Patch(":userId/:todoId")
  async updateTodo(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("todoId", ParseIntPipe) todoId: number,
    @Body() data: Partial<Todo>
  ): Promise<Todo> {
    return this.todoService.updateTodo(userId, todoId, data);
  }

  // 🔹 5. 특정 사용자의 할 일 삭제 (DELETE /todos/:userId/:todoId)
  @Delete(":userId/:todoId")
  async deleteTodo(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("todoId", ParseIntPipe) todoId: number
  ): Promise<void> {
    return this.todoService.deleteTodo(userId, todoId);
  }
}
