import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Auth as AdminAuth } from "firebase-admin/auth";

@Injectable()
export class FirebaseService {
    admin: AdminAuth;

    constructor(private configService: ConfigService) {
        //this.admin = getAdminAuth();
    }
    async validateUser(email: string, pass : string): Promise<any> {
        console.log(pass);
        try {
          const userRecord = await this.admin.getUserByEmail(email);
          // 비밀번호 검증 로직 추가 (Firebase Admin SDK는 비밀번호 해시를 제공하지 않으므로, 별도의 비밀번호 검증 로직이 필요합니다)
          // 이 예제에서는 비밀번호 검증 로직을 생략합니다.
          return userRecord;
        } catch (error) {
          console.error('Error fetching user data:', error);
          return null;
        }
      }
    
      async login(user: any) {
        const token = await this.admin.createCustomToken(user.uid);
        return {
          access_token: token,
        };
      }
    
}