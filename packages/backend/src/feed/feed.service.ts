import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Feed } from "./feed.entity";

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed)
    private feedRepository: Repository<Feed>
  ) {}

  // 🔹 1. 피드 생성
  async createFeed(data: Partial<Feed>): Promise<Feed> {
    const newFeed = this.feedRepository.create({
      ...data,
      createdAt: new Date(),
      likes: [],
      comments: [],
    });
    return await this.feedRepository.save(newFeed);
  }

  // 🔹 2. 모든 피드 가져오기
  async getAllFeeds(): Promise<Feed[]> {
    return await this.feedRepository.find({ order: { createdAt: "DESC" } });
  }

  // 🔹 3. 특정 피드 가져오기
  async getFeedById(id: number): Promise<Feed> {
    const feed = await this.feedRepository.findOne({ where: { id } });
    if (!feed) throw new NotFoundException(`Feed with ID ${id} not found`);
    return feed;
  }

  // 🔹 4. 피드 수정
  async updateFeed(id: number, data: Partial<Feed>): Promise<Feed> {
    await this.feedRepository.update(id, data);
    return this.getFeedById(id);
  }

  // 🔹 5. 피드 삭제
  async deleteFeed(id: number): Promise<void> {
    await this.feedRepository.delete(id);
  }
}
