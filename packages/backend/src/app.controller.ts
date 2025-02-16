import { Controller, Get, Request, Res, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { join } from "path";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHomepage(): string {
    // 정적 파일(index.html)을 자동으로 제공하므로 특별한 로직 필요 없음
    return "Hello World!";
  }
}
