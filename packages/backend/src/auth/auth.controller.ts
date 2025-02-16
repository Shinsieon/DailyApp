import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Put,
  Delete,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { UserResponse } from "src/types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      nickname: string;
      type?: "email" | "kakao" | "apple";
    }
  ): Promise<UserResponse> {
    const result = await this.authService.register(
      body.email,
      body.password,
      body.nickname,
      body.type
    );
    return result;
  }

  @Post("login")
  async login(@Req() req: any) {
    const { email, password, type } = req.body;
    return this.authService.login(email, password, type);
  }

  @UseGuards(AuthGuard)
  @Put("nickname")
  async updateNickname(@Req() req: any, @Body() body: { nickname: string }) {
    return this.authService.updateNickname(req.user.id, body.nickname);
  }

  @UseGuards(AuthGuard)
  @Get("me")
  async getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Delete("me")
  async deleteProfile(@Req() req) {
    return this.authService.deleteProfile(req.user.id);
  }
}
