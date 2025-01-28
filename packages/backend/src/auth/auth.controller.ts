import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Put,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body() body: { email: string; password: string; nickname: string }
  ) {
    return this.authService.register(body.email, body.password, body.nickname);
  }

  @Post("login")
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard)
  @Put("nickname")
  async updateNickname(@Req() req: any, @Body() body: { nickname: string }) {
    return this.authService.updateNickname(req.user.id, body.nickname);
  }
}
