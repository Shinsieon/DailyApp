import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService : JwtService,
      private configService: ConfigService
    ) {
      console.log(configService.get<string>('DB_NAME'), "에 연결합니다.")
    }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("activation start")
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if(!token){
        console.error('Token not found');
        throw new UnauthorizedException('Token not found');
    }
    try{
        const payload = await this.jwtService.verifyAsync(token, {
            secret: this.configService.get<string>('JWT_SECRET'),
        });
        request['user'] = payload;  

    }catch{
      console.error('Invalid token');
        throw new UnauthorizedException('Invalid token');
    }
    console.log("activation end")
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined{
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
