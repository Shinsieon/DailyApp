import { Controller, Get, Request, Res, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  serveFrontend(@Request() req, @Res() res) {
    res.sendFile("index.html", { root: "frontend/dist" });
  }
}
