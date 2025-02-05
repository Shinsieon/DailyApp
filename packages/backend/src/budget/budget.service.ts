import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Budget } from "./budget.entity";
import { User } from "src/auth/auth.entity";
import { Category } from "src/category/category.entity";

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  // 🔹 Budget 생성 (User 연결)
  async createBudget(
    userId: number,
    budgetData: Partial<Budget>
  ): Promise<Budget> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    const budget = this.budgetRepository.create({ ...budgetData, user });
    return this.budgetRepository.save(budget);
  }

  // 🔹 특정 유저의 Budget 가져오기
  async getBudgetsByUser(userId: number): Promise<Budget[]> {
    return this.budgetRepository.find({
      where: { user: { id: userId } },
      relations: ["user", "category"],
    });
  }

  async updateBudget(
    userId: number,
    budgetId: number,
    budgetData: Partial<Budget>
  ): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({
      where: { id: budgetId, user: { id: userId } },
    });

    if (!budget) {
      throw new Error("Budget not found");
    }

    await this.budgetRepository.update({ id: budgetId }, budgetData);
    return this.budgetRepository.findOne({ where: { id: budgetId } });
  }

  async createMultipleBudgets(
    userId: number,
    budgetsData: Partial<Budget>[]
  ): Promise<Budget[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    // 기존 Budget 데이터 삭제
    await this.budgetRepository.delete({ user: { id: userId } });

    // 🔹 비동기 처리된 Category 조회 및 Budget 생성
    const budgets: Budget[] = [];
    for (const budgetData of budgetsData) {
      const category = await this.categoryRepository.findOne({
        where: { id: budgetData.category.id },
      });

      if (!category) {
        throw new Error(`Category not found for ID: ${budgetData.category.id}`);
      }
      const budget = this.budgetRepository.create({
        ...budgetData,
        user,
        category,
      });

      budgets.push(budget);
    }

    // 🔹 한 번에 저장 (배열을 전달)
    return this.budgetRepository.save(budgets);
  }

  async deleteBudget(userId: number, budgetId: number): Promise<void> {
    await this.budgetRepository.delete({ id: budgetId, user: { id: userId } });
  }
}
