import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Survey } from "./app.entity";

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>
  ) {}
  async sendSurvey(message: string) {
    console.log(`📝 설문 내용: ${message}`);
    const survey = new Survey();
    survey.content = message;
    await this.surveyRepository.save(survey);
    return { message: "설문이 성공적으로 제출되었습니다." };
  }
  async getSurvey() {
    const surveys = await this.surveyRepository.find();
    return surveys;
  }
}
