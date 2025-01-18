import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findOne(email);
    if(!user) {
      console.error("사용자 계정이 없습니다.")
      throw new NotFoundException('User does not exist');
    }
    if(user?.password !== pass) { 
      throw new UnauthorizedException('Wrong password');
    }
    const payload = { email: user.email, sub: user.id };
    const { password, ...result } = user;
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, { expiresIn: '7d' }),
      user: result,
    };
  }

  async getProfile(email: string) {
    const user = await this.usersService.findOne(email);
    delete user.password;
    return user;
  }

  async signUp(signupDto: SignupDto) {
    console.log(signupDto)
    return this.usersService.create(signupDto);
  }

  async refreshToken(refreshToken: string) {
    try {
      console.log("trying to verify");
      const decoded = await this.jwtService.verifyAsync(refreshToken);
      console.log("decoded", decoded);
      const payload = { email: decoded.email, sub: decoded.sub };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.log("error", error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async deleteAccount(email: string) {
    return this.usersService.remove(email);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOne(email);
    console.log("found user", user);
    if(user){
      user.password = user.password.substring(0, 3) + "****";
      return user;
    }else{
      throw new UnauthorizedException('User not found');
    }
  }

  async resetPassword(email: string, password: string) {
    await this.usersService.resetPassword(email, password);
  }

  async changeNickname(email: string, nickname: string) {
    return this.usersService.changeNickname(email, nickname);
  }

  async getAppleProfile(appleUserId: string) {
    return this.usersService.getAppleProfile(appleUserId);
  }


}
