import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email, password } = request.body;
    // 필수 필드 검증
    if (!email || !password) {
      throw new UnauthorizedException("필수 필드가 누락되었습니다.");
    }

    // 사용자 인증
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException("유효하지 않은 인증 정보입니다.");
    }

    // 인증된 사용자 객체를 요청에 추가
    request.user = user;

    return true;
  }
}
