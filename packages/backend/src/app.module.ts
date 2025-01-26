import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { CustomLogger } from "./logger/logger.service";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "./logger/loggin.interceptor";
import { PatchNoteModule } from "./patch-note/patch-note.module";
import { ServeStaticModule } from "@nestjs/serve-static";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../", "../frontend/dist"), // 정적 파일 경로
      exclude: ["/api*"], // API 경로 제외
    }),
    ConfigModule.forRoot({
      isGlobal: true, // 모든 모듈에서 환경 변수를 사용할 수 있도록 설정
      envFilePath:
        process.env.NODE_ENV === "production" ? ".env.production" : ".env", // 환경에 따라 파일 선택
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get<string>("DB_HOST"),
        port: configService.get<number>("DB_PORT"),
        username: configService.get<string>("DB_USERNAME"),
        password: configService.get<string>("DB_PASSWORD"),
        database: configService.get<string>("DB_NAME"),
        entities: [join(__dirname, "**", "*.entity.{ts,js}")],
        synchronize: true,
        dropSchema: false,
      }),
      inject: [ConfigService],
    }),
    PatchNoteModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CustomLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
