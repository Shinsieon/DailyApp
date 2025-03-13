import { ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FirebaseAdmin {
  private adminInstance: admin.app.App;

  constructor(private readonly configService: ConfigService) {
    const firebaseConfig = this.configService.get<string>("FIREBASE_CONFIG");

    if (!firebaseConfig) {
      throw new Error("Missing FIREBASE_CONFIG environment variable");
    }

    this.adminInstance = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(firebaseConfig)),
    });
  }

  getInstance() {
    return this.adminInstance;
  }
}
