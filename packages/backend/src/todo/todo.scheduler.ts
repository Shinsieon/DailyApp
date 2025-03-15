import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { TodoService } from "./todo.service";

@Injectable()
export class TodoScheduler {
  private readonly logger = new Logger(TodoScheduler.name);

  constructor(private readonly todoService: TodoService) {}

  // 🔹 매 30분마다 실행
  @Cron("0 */10 * * * *") // 매 10분마다 실행
  //  @Cron("*/5 * * * * *")
  async handleScheduledNotifications() {
    this.logger.log("Checking for todos that need notifications...");

    const todosToNotify = await this.todoService.findTodosForNotification();

    if (todosToNotify.length === 0) {
      this.logger.log("No todos need notifications.");
      return;
    }

    this.logger.log(`Sent notifications for ${todosToNotify.length} todos.`);
    this.todoService.findDeviceAndSendNotification(todosToNotify);
  }
}
