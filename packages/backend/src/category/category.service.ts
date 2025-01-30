import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async getAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async create(patchNoteData: Partial<Category>): Promise<Category> {
    const newPatchNote = this.categoryRepository.create(patchNoteData);
    return await this.categoryRepository.save(newPatchNote);
  }
}
