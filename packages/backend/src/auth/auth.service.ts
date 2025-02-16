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

interface UserResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    nickname: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async findByEmail(email: string, includeDeleted = false) {
    if (!includeDeleted) {
      return await this.userRepository.findOne({ where: { email } });
    }
    return await this.userRepository
      .createQueryBuilder("user")
      .where("user.email = :email", { email })
      .withDeleted() // 👈 소프트 삭제된 유저도 포함
      .getOne();
  }

  // 사용자 등록 (이메일/비밀번호)
  async register(
    email: string,
    password: string,
    nickname: string,
    type?: "apple" | "kakao" | "email"
  ): Promise<UserResponse> {
    if (type === "apple") {
      const decoded = this.jwtService.decode(email) as {
        email?: string;
        nickname?: string;
      };

      if (!decoded?.email) {
        throw new UnauthorizedException("유효하지 않은 토큰입니다.");
      }

      email = decoded.email;
      nickname = decoded.nickname || "Apple User"; // Apple에서 닉네임이 제공되지 않는 경우 대비
      password = password ? await bcrypt.hash(password, 10) : undefined;
    } else {
      email = email.toLowerCase();
      password = await bcrypt.hash(password, 10);
    }

    let user = await this.findByEmail(email, true);

    if (user) {
      if (user.deletedAt) {
        await this.userRepository.restore(user.id);
        user.deletedAt = null;
        user.password = password;
        user.nickname = nickname;
        await this.userRepository.save(user);
        return {
          access_token: this.jwtService.sign({
            sub: user.id,
            email: user.email,
          }),
          user: {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
          },
        };
      }
      throw new UnauthorizedException("이미 가입된 계정입니다.");
    }

    // 새 유저 생성 및 저장
    user = this.userRepository.create({ email, password, nickname });
    await this.userRepository.save(user);

    return {
      access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
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
  async login(email: string, password?: string, type?: "apple" | "kakao") {
    let user;

    if (type === "apple") {
      const decoded = this.jwtService.decode(email) as { email?: string };

      if (!decoded?.email) {
        throw new UnauthorizedException("유효하지 않은 토큰입니다.");
      }

      user = await this.findByEmail(decoded.email);
    } else {
      user = await this.findByEmail(email);
    }

    if (!user) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }

    // 일반 로그인 시 비밀번호 검증
    if (!type && !(await this.validateUser(email, password))) {
      throw new UnauthorizedException("로그인 정보가 일치하지 않습니다.");
    }

    // JWT 토큰 생성 및 응답
    return {
      access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
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
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };
  }

  // 사용자 삭제
  async deleteProfile(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }
    await this.userRepository.softRemove(user);
    return user;
  }
}
