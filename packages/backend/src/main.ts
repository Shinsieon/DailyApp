import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
async function bootstrap() {
  console.log("mode:", process.env.NODE_ENV);
  let app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://172.30.1.11:3001",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });
  // 정적 파일 서빙
  app.setGlobalPrefix("api/v1");
  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
