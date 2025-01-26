import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly patchNoteRepository: Repository<Category>
  ) {}

  async getAll(): Promise<Category[]> {
    return await this.patchNoteRepository.find();
  }

  async create(patchNoteData: Partial<Category>): Promise<Category> {
    const newPatchNote = this.patchNoteRepository.create(patchNoteData);
    return await this.patchNoteRepository.save(newPatchNote);
  }
}
