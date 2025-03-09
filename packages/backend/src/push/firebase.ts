import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config();
// 환경변수에서 JSON 데이터를 직접 불러오기
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG || "{}");
// Firebase 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
