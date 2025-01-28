import { Controller, Get, Post, Body, UseGuards, Req } from "@nestjs/common";
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

  @UseGuards(AuthGuard)
  @Post("login")
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }
}
