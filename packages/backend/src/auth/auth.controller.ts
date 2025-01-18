import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './auth.guard';
import { SignupDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({transform: true}))
  @Post('register')
  async register(@Body() signupDto: SignupDto) {
    console.log(signupDto)
    return this.authService.signUp(signupDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return await this.authService.getProfile(req.user.email);
  }
  @UseGuards(AuthGuard)
  @Get('validate-token')
  async validateToken(@Request() req) {
    return true;
  }
  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    console.log("refreshToken", refreshToken);
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(AuthGuard)
  @Delete('delete')
  async deleteAccount(@Request() req) {
    return this.authService.deleteAccount(req.user.email);
  }


  @Post('forgot-password')
  async forgotPassword(@Body() req) {
    return this.authService.forgotPassword(req.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() req) {
    return this.authService.resetPassword(req.email, req.password);
  }

  @UseGuards(AuthGuard)
  @Post('change-nickname')
  async changeNickname(@Request() req, @Body() reqBody) {
    return this.authService.changeNickname(req.user.email, reqBody.nickname);
  }

  @Post('appleProfile')
  async getAppleProfile(@Request() req) {
    return await this.authService.getAppleProfile(req.user.appleUserId);
  }
}
