import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "../category/category.entity"; // 예제 엔티티

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async seed() {
    const existingCategories = await this.categoryRepository.find();
    if (existingCategories.length === 0) {
      console.log("No categories found. Seeding default data...");
      await this.categoryRepository.save([
        { type: "income", label: "월급", value: "salary" },
        { type: "income", label: "용돈", value: "allowance" },
        { type: "income", label: "사업소득", value: "business" },
        { type: "income", label: "보너스", value: "bonus" },
        { type: "income", label: "이자수익", value: "interest" },
        { type: "income", label: "투자수익", value: "investment" },
        { type: "income", label: "임대수익", value: "rental" },
        { type: "income", label: "정부지원금", value: "government_support" },
        { type: "income", label: "프리랜서 수입", value: "freelance" },
        { type: "income", label: "기타", value: "others" },
        { type: "expense", label: "식비", value: "food" },
        { type: "expense", label: "교통비", value: "transportation" },
        { type: "expense", label: "문화생활", value: "entertainment" },
        { type: "expense", label: "의료비", value: "medical" },
        { type: "expense", label: "교육비", value: "education" },
        { type: "expense", label: "주거비", value: "housing" },
        { type: "expense", label: "쇼핑", value: "shopping" },
        { type: "expense", label: "공과금", value: "utilities" },
        { type: "expense", label: "여행", value: "travel" },
        { type: "expense", label: "취미활동", value: "hobbies" },
        { type: "expense", label: "보험료", value: "insurance" },
        { type: "expense", label: "기타", value: "others" },
      ]);
      console.log("Default categories seeded successfully.");
    } else {
      console.log("Categories already exist. Skipping seed.");
    }
  }
}
