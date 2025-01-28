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
    //bearer token
    console.log(request.headers.authorization);
    const access_token = request.headers.authorization?.split(" ")[1];
    if (!access_token) {
      throw new UnauthorizedException("유효하지 않은 인증 정보입니다.");
    }
    // 사용자 인증
    // 인증된 사용자 객체를 요청에 추가
    request.user = await this.authService.validateToken(access_token);
    return true;
  }
}
