import { Module, OnApplicationBootstrap } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeederService } from "./seeder.service";
import { Category } from "../category/category.entity"; // 예제 엔티티

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // Seeder가 사용할 엔티티
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule implements OnApplicationBootstrap {
  constructor(private readonly seederService: SeederService) {}

  async onApplicationBootstrap() {
    // 애플리케이션 부트스트랩 시 실행
    await this.seederService.seed();
  }
}
