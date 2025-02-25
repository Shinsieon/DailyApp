import { Controller, Get, Post, Request, Res, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import axios from "axios";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHomepage(): string {
    // 정적 파일(index.html)을 자동으로 제공하므로 특별한 로직 필요 없음
    return "Hello World!";
  }
  @Get("weather")
  async getWeather(@Request() req, @Res() res) {
    const date = req.query.date;
    const nx = req.query.nx;
    const ny = req.query.ny;
    try {
      const serviceKey = process.env.WEATHER_API_KEY; // ✅ API 키 디코딩

      const url =
        "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

      const params = {
        ServiceKey: serviceKey,
        numOfRows: "230",
        pageNo: "1",
        dataType: "JSON",
        base_date: date,
        base_time: "0500",
        nx: String(nx),
        ny: String(ny),
      };

      console.log(`📡 요청 URL: ${url}`);
      console.log(`📡 요청 파라미터: ${JSON.stringify(params)}`);

      const response = await axios.get(url, {
        params: params,
      });

      const data = response.data.response.body.items.item;
      return res.json(data);
    } catch (error: any) {
      console.error(`❌ 날씨 데이터 요청 실패: ${error}`);
    }
  }
  @Post("survey")
  async sendSurvey(@Request() req, @Res() res) {
    const message = req.body.message;
    try {
      console.log(`📝 설문 내용: ${message}`);
      await this.appService.sendSurvey(message);
      return res.json({ message: "설문이 성공적으로 제출되었습니다." });
    } catch (error: any) {
      console.error(`❌ 설문 제출 실패: ${error}`);
    }
  }
}
