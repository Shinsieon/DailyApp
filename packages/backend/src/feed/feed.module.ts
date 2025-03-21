import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Feed } from "./feed.entity";
import { FeedService } from "./feed.service";
import { FeedController } from "./feed.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Feed])],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
