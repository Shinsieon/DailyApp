import { Controller, Get, Post, Body } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Category } from "./category.entity";

@Controller("categories")
export class CategoryController {
  constructor(private readonly patchNoteService: CategoryService) {}

  @Get()
  async getAll(): Promise<Category[]> {
    return await this.patchNoteService.getAll();
  }

  @Post()
  async create(@Body() patchNoteData: Partial<Category>): Promise<Category> {
    return await this.patchNoteService.create(patchNoteData);
  }
}
