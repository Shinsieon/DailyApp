import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Todo } from "./todo.entity";
import { User } from "src/auth/auth.entity";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

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

    const newTodo = this.todoRepository.create({
      ...data,
      user, // 👈 user 추가
    });

    return await this.todoRepository.save(newTodo);
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
