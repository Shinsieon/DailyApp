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
import { BudgetService } from "./budget.service";
import { Budget } from "./budget.entity";

@Controller("budgets")
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  // 🔹 1. 특정 사용자의 모든 할 일 조회 (GET /Budgets/user/:userId)
  @Get("user/:userId")
  async getUserBudgets(
    @Param("userId", ParseIntPipe) userId: number
  ): Promise<Budget[]> {
    return this.budgetService.getBudgetsByUser(userId);
  }

  // 🔹 3. 특정 사용자의 할 일 추가 (POST /Budgets/:userId)
  @Post(":userId")
  async createBudget(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() data: Partial<Budget>
  ): Promise<Budget> {
    return this.budgetService.createBudget(userId, data);
  }

  // 3-1. 특정 사용자의 여러 할 일 한번에 추가 (POST /Budgets/multiple/:userId)
  @Post("multiple/:userId")
  async createMultipleBudgets(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() data: any
  ): Promise<Budget[]> {
    return this.budgetService.createMultipleBudgets(userId, data.budgets);
  }

  // 🔹 4. 특정 사용자의 할 일 수정 (PATCH /Budgets/:userId/:BudgetId)
  @Patch(":userId/:BudgetId")
  async updateBudget(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("budgetId", ParseIntPipe) budgetId: number,
    @Body() data: Partial<Budget>
  ): Promise<Budget> {
    return this.budgetService.updateBudget(userId, budgetId, data);
  }

  // 🔹 5. 특정 사용자의 할 일 삭제 (DELETE /Budgets/:userId/:BudgetId)
  @Delete(":userId/:BudgetId")
  async deleteBudget(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("budgetId", ParseIntPipe) budgetId: number
  ): Promise<void> {
    return this.budgetService.deleteBudget(userId, budgetId);
  }
}
