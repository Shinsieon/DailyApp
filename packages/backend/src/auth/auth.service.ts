import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User } from "./auth.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  // 이메일로 사용자 조회
  async findByEmail(email: string): Promise<User | undefined> {
    email = email.toLowerCase();
    const user = await this.userRepository.findOne({ where: { email } });
    console.log("find by email", user);
    return user;
  }

  // 사용자 등록 (이메일/비밀번호)
  async register(email: string, password: string, nickname: string) {
    console.log(email, password, nickname);
    email = email.toLowerCase();
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException("이미 가입된 계정입니다.");
    }

    const newUser = this.userRepository.create({
      email,
      password: await bcrypt.hash(password, 10),
      nickname,
    });
    await this.userRepository.save(newUser);
    return {
      data: {
        access_token: this.jwtService.sign({ sub: newUser.id }),
        user: {
          email: newUser.email,
          nickname: newUser.nickname,
        },
      },
    };
  }

  // 사용자 검증
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    console.log("비밀번호 불일치", password, user.password);
    return null;
  }

  // JWT 토큰 검증
  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return await this.findByEmail(decoded.email);
    } catch (error) {
      throw new UnauthorizedException("유효하지 않은 토큰입니다.");
    }
  }

  // JWT 토큰 생성
  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      data: {
        access_token: this.jwtService.sign(payload),
        user: {
          email: user.email,
          nickname: user.nickname,
        },
      },
    };
  }

  // 닉네임 변경
  async updateNickname(userId: number, nickname: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }
    user.nickname = nickname;
    await this.userRepository.save(user);
    return {
      data: {
        email: user.email,
        nickname: user.nickname,
      },
    };
  }
}
