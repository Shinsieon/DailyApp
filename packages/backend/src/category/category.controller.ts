import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Category } from "./category.entity";

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // @Get()
  // async getAll(@Param("userId") userId?: number): Promise<Category[]> {
  //   return await this.categoryService.getAll(userId);
  // }
  @Get()
  async getAll(): Promise<Category[]> {
    return await this.categoryService.getAll();
  }

  @Get(":userId")
  async getAllByUser(@Param("userId") userId: number): Promise<Category[]> {
    return await this.categoryService.getAll(userId);
  }

  @Post(":userId")
  async create(
    @Param("userId") userId: number,
    @Body() { type, name }: { type: string; name: string }
  ): Promise<Category> {
    return await this.categoryService.create(userId, type, name);
  }

  @Delete(":userId/:id")
  async delete(
    @Param("userId") userId: number,
    @Param("id") id: number
  ): Promise<void> {
    return await this.categoryService.delete(userId, id);
  }

  @Patch(":userId/:id")
  async update(
    @Param("userId") userId: number,
    @Param("id") id: number,
    @Body() { type, name }: { type: string; name: string }
  ): Promise<Category> {
    return await this.categoryService.update(userId, id, type, name);
  }
}
