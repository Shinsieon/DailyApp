import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
} from "@nestjs/common";
import { DiaryService } from "./diary.service";
import { Diary, DiaryDto } from "./diary.entity";

@Controller("diary")
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  // 📌 다이어리(상위 컨테이너) 생성 - 유저 기준 1회만 호출
  @Post(":userId")
  async createDiary(@Param("userId") userId: string) {
    return await this.diaryService.createDiary(Number(userId));
  }

  //  특정 사용자의 여러 다이어리 한번에 추가
  @Post("multiple/:userId")
  async createMultipleDiaries(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() data: any
  ): Promise<Diary[]> {
    return this.diaryService.createMultipleDiaries(userId, data.diaries);
  }

  // 📌 유저의 전체 일기 조회
  @Get(":userId")
  async getUserDiary(@Param("userId") userId: string) {
    const diary = await this.diaryService.getUserDiary(Number(userId));
    if (!diary) throw new NotFoundException("Diary not found");
    const diaries: DiaryDto[] = [];
    let date = "";
    for (const d of diary) {
      if (date !== d.date) {
        date = d.date;
        diaries.push({ date: d.date, diaries: [] });
      }
      diaries[diaries.length - 1].diaries.push({
        title: d.title,
        content: d.content,
      });
    }
    return diaries;
  }

  // 📌 유저의 일기 삭제
  @Delete(":userId")
  async deleteUserDiary(@Param("userId") userId: string) {
    await this.diaryService.deleteDiary(Number(userId));
    return { message: "Diary deleted" };
  }
}
