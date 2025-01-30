import { Controller, Get, Post, Body } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Category } from "./category.entity";

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll(): Promise<Category[]> {
    return await this.categoryService.getAll();
  }

  @Post()
  async create(@Body() categoryData: Partial<Category>): Promise<Category> {
    return await this.categoryService.create(categoryData);
  }
}
