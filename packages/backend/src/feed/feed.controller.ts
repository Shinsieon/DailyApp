// 1.	새로운 피드 생성 (POST /feeds)
// 2.	모든 피드 가져오기 (GET /feeds)
// 3.	특정 피드 가져오기 (GET /feeds/:id)
// 4.	피드 수정 (PATCH /feeds/:id)
// 5.	피드 삭제 (DELETE /feeds/:id)
// 6.	좋아요 추가/취소 (POST /feeds/:id/like)
// 7.	댓글 추가 (POST /feeds/:id/comment)

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from "@nestjs/common";
import { FeedService } from "./feed.service";
import { Feed } from "./feed.entity";

@Controller("feeds")
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  // 🔹 1. 새 피드 작성 (POST /feeds)
  @Post()
  async createFeed(@Body() data: Partial<Feed>): Promise<Feed> {
    return this.feedService.createFeed(data);
  }

  // 🔹 2. 모든 피드 조회 (GET /feeds)
  @Get()
  async getAllFeeds(): Promise<Feed[]> {
    return this.feedService.getAllFeeds();
  }

  // 🔹 3. 특정 피드 조회 (GET /feeds/:id)
  @Get(":id")
  async getFeedById(@Param("id") id: number): Promise<Feed> {
    return this.feedService.getFeedById(id);
  }

  // 🔹 4. 피드 수정 (PATCH /feeds/:id)
  @Patch(":id")
  async updateFeed(
    @Param("id") id: number,
    @Body() data: Partial<Feed>
  ): Promise<Feed> {
    return this.feedService.updateFeed(id, data);
  }

  // 🔹 5. 피드 삭제 (DELETE /feeds/:id)
  @Delete(":id")
  async deleteFeed(@Param("id") id: number): Promise<void> {
    return this.feedService.deleteFeed(id);
  }
}
