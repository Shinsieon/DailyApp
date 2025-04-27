import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Diary, DiaryDto } from "./diary.entity";
import { Repository } from "typeorm";
import { User } from "@src/auth/auth.entity";

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepo: Repository<Diary>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async createDiary(userId: number): Promise<Diary> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("User not found");

    const diary = this.diaryRepo.create({ user });
    return this.diaryRepo.save(diary);
  }

  async createMultipleDiaries(
    userId: number,
    data: Partial<DiaryDto>[]
  ): Promise<Diary[]> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("User not found");
    await this.diaryRepo.delete({ user: { id: userId } });

    let allDiaries = [];

    for (const diary of data) {
      for (const diaryItem of diary.diaries) {
        const isExist = await this.diaryRepo.findOne({
          where: {
            user: { id: userId },
            date: diary.date,
            title: diaryItem.title,
          },
        });
        if (isExist) {
          console.log("Diary already exists");
          //if exists, update
          const updatedDiaryItem = this.diaryRepo.create({
            ...isExist,
            title: diaryItem.title,
            content: diaryItem.content,
            date: diary.date,
            user,
          });
          const savedDiaryItem = await this.diaryRepo.save(updatedDiaryItem);
          allDiaries.push(savedDiaryItem);
          console.log("Diary updated");
        } else {
          const newDiaryItem = this.diaryRepo.create({
            title: diaryItem.title,
            content: diaryItem.content,
            date: diary.date,
            user,
          });
          const savedDiaryItem = await this.diaryRepo.save(newDiaryItem);
          allDiaries.push(savedDiaryItem);
        }
      }
    }

    return allDiaries;
  }

  async getUserDiary(userId: number): Promise<Diary[]> {
    return this.diaryRepo.find({
      where: { user: { id: userId } },
    });
  }

  async deleteDiary(userId: number): Promise<void> {
    const diary = await this.diaryRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!diary) throw new NotFoundException("Diary not found");
    await this.diaryRepo.delete(diary.id);
  }
}
