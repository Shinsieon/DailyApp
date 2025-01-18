import { Controller, Get, Request, Res, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { join } from "path";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("*")
  serveFrontend(@Res() res) {
    const rootPath = join(__dirname, "../frontend/dist");
    res.sendFile("index.html", { root: rootPath });
  }
}
