import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/auth.entity";
import { Budget } from "./budget.entity";
import { BudgetController } from "./budget.controller";
import { BudgetService } from "./budget.service";
import { Category } from "src/category/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Budget, User, Category])], // TypeORM 등록
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
