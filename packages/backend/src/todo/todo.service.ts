import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Todo } from "./todo.entity";
import { User } from "src/auth/auth.entity";
import { Noti } from "@src/noti/noti.entity";
import { PushService } from "@src/push/push.service";
import * as moment from "moment-timezone";

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Noti)
    private notiRepository: Repository<Noti>,
    private pushService: PushService
  ) {}

  async findTodosForNotification() {
    // const now = new Date();
    // const nowString = now.toISOString().split("T")[0];
    // const nowTime = now.toTimeString().split(" ")[0].substring(0, 5);
    const now = moment().tz("Asia/Seoul");
    const nowString = now.format("YYYY-MM-DD");
    const nowTime = now.format("HH:mm");
    // 1️⃣ 알림이 필요한 Todo 조회
    const todos = await this.todoRepository.find({
      where: { date: nowString, notification: nowTime },
      relations: ["user"], // 🔹 User 관계 포함하여 가져오기
    });
    return todos;
  }

  async findDeviceAndSendNotification(todos: Todo[]) {
    if (todos.length === 0) return;

    // 2️⃣ 각 Todo의 UserId를 사용하여 Noti 테이블에서 deviceId 조회
    for (const todo of todos) {
      const noti = await this.notiRepository.findOne({
        where: { user: { id: todo.user.id } },
      });

      if (noti) {
        // 3️⃣ 푸시 알림 전송
        await this.pushService.sendPushNotification(
          todo.user.id,
          "할 일 알림",
          todo.title
        );
      } else {
        this.logger.warn(
          `No deviceId found for User ID: ${todo.user.id}, skipping notification`
        );
      }
    }
  }

  // 🔹 1. 특정 유저의 모든 할 일 가져오기
  async getUserTodos(userId: number): Promise<Todo[]> {
    return this.todoRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: "DESC" },
    });
  }

  // 🔹 2. 특정 유저의 특정 할 일 가져오기
  async getTodoById(userId: number, todoId: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id: todoId, user: { id: userId } },
    });
    if (!todo) throw new NotFoundException(`Todo with ID ${todoId} not found`);
    return todo;
  }

  // 🔹 3. 특정 유저가 할 일 추가
  async createTodo(userId: number, data: Partial<Todo>): Promise<Todo> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    const existedTodo = await this.todoRepository.findOne({
      where: { id: data.id, user: { id: userId } },
    });
    if (existedTodo) {
      this.updateTodo(userId, existedTodo.id, data);
      return existedTodo;
    } else {
      const newTodo = this.todoRepository.create({
        ...data,
        user, // 👈 user 추가
      });

      return await this.todoRepository.save(newTodo);
    }
  }

  // 3-1. 특정 유저가 여러 할 일 추가
  async createMultipleTodos(
    userId: number,
    todos: Partial<Todo>[] = []
  ): Promise<Todo[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    await this.todoRepository.delete({ user: { id: userId } });
    const newTodos = todos.map((todo) =>
      this.todoRepository.create({
        ...todo,
        user, // 👈 user 추가
      })
    );

    return await this.todoRepository.save(newTodos);
  }

  // 🔹 4. 특정 유저가 할 일 수정
  async updateTodo(
    userId: number,
    todoId: number,
    data: Partial<Todo>
  ): Promise<Todo> {
    const todo = await this.getTodoById(userId, todoId);
    Object.assign(todo, data);
    return this.todoRepository.save(todo);
  }

  // 🔹 5. 특정 유저가 할 일 삭제
  async deleteTodo(userId: number, todoId: number): Promise<void> {
    const todo = await this.getTodoById(userId, todoId);
    await this.todoRepository.remove(todo);
  }
}
