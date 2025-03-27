import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";
import { User } from "@src/auth/auth.entity";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getAll(userId?: number): Promise<Category[]> {
    if (!userId) {
      return this.categoryRepository
        .createQueryBuilder("category")
        .leftJoinAndSelect("category.user", "user")
        .where("user.id IS NULL")
        .getMany();
    }
    return this.categoryRepository
      .createQueryBuilder("category")
      .leftJoinAndSelect("category.user", "user")
      .where("user.id = :userId", { userId })
      .getMany();
  }

  async create(userId: number, type: string, name: string): Promise<Category> {
    console.log(`userId: ${userId}, type: ${type}, name: ${name}`);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    const category = new Category();
    category.type = type;
    category.label = name;
    category.value = name;
    category.user = user;
    return await this.categoryRepository.save(category);
  }

  async delete(userId: number, id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { user: { id: userId }, id },
    });
    if (!category) {
      throw new Error("Category not found");
    }
    console.log(`delete category: ${JSON.stringify(category)}`);

    await this.categoryRepository.remove(category);
  }

  async update(
    userId: number,
    id: number,
    type: string,
    name: string
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { user: { id: userId }, id },
    });
    if (!category) {
      throw new Error("Category not found");
    }

    category.type = type;
    category.label = name;
    category.value = name;
    return await this.categoryRepository.save(category);
  }
}
