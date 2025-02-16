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

  // 🔹 6. 좋아요 추가/취소
  async toggleLike(id: number, userId: string): Promise<Feed> {
    const feed = await this.getFeedById(id);
    const likeIndex = feed.likes.indexOf(userId);
    if (likeIndex > -1) {
      // 이미 좋아요한 경우 취소
      feed.likes.splice(likeIndex, 1);
    } else {
      // 좋아요 추가
      feed.likes.push(userId);
    }
    return await this.feedRepository.save(feed);
  }

  // 🔹 7. 댓글 추가
  async addComment(id: number, userId: string, text: string): Promise<Feed> {
    const feed = await this.getFeedById(id);
    feed.comments.push({ userId, text, createdAt: new Date().toString() });
    return await this.feedRepository.save(feed);
  }
}
