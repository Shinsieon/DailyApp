import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { join } from "path";
import * as express from "express";
async function bootstrap() {
  let app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:8081",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });
  // 정적 파일 서빙
  const frontendPath = join(__dirname, "../", "../frontend/dist");
  app.use(express.static(frontendPath));
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(
    `Application is running on: ${await app.getUrl()}`,
    "mode:",
    process.env.NODE_ENV
  );
}

bootstrap();
