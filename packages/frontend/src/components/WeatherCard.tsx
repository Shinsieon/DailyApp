import { useEffect, useState } from "react";
import { api } from "../api";
import { Col, Flex, Row } from "antd";
import dayjs from "dayjs";
import snow from "../assets/snow.png";
import rain from "../assets/rainy.png";
import cloudy from "../assets/cloudy.png";
import sun from "../assets/sun.png";
import { Image, Steps } from "antd-mobile";
import Label from "./Label";
import { IoWaterOutline } from "react-icons/io5";
import { BsThermometerHalf } from "react-icons/bs";
import { FiCloudRain } from "react-icons/fi";
import { FaWind } from "react-icons/fa";
import { colors } from "../colors";
import Title from "./Title";
import { sendToNative } from "../hooks/useNative";
const { Step } = Steps;

enum WeatherCategory {
  VEC = "VEC", // 풍향
  WSD = "WSD", // 풍속
  REH = "REH", // 습도
  PTY = "PTY", // 강수형태
  POP = "POP", // 강수확률
  PCP = "PCP", // 강수량
  SNO = "SNO", // 눈
  SKY = "SKY", // 하늘상태
  TMP = "TMP", // 기온
  UUU = "UUU", // 동서바람성분
  VVV = "VVV", // 남북바람성분
  WAV = "WAV", // 파고
}
interface WeatherProps {
  baseDate: string;
  baseTime: string;
  category: WeatherCategory;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}
interface WeatherMap {
  fcstTime: string; // 예보 시간 (ex: "0500", "0700", ...)
  [key: string]: string; // 날씨 데이터 (카테고리 키-값 매핑)
}
//PTY(강수형태): 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4), 빗방울(5), 빗방울/눈날림(6), 눈날림(7)
const getWeatherImage = (PTY: string) => {
  switch (PTY) {
    case "0":
      return sun;
    case "1":
      return rain;
    case "2":
      return rain;
    case "3":
      return snow;
    case "4":
      return cloudy;
    case "5":
      return rain;
    case "6":
      return rain;
    case "7":
      return snow;
    default:
      return sun;
  }
};
// 2시간 간격 필터링
const filterWeatherData = (data: WeatherProps[]) => {
  const weatherMap: WeatherMap[] = [
    {
      fcstTime: "0600",
      PTY: "0",
      REH: "0",
      TMP: "0",
      POP: "0",
      WSD: "0",
    },
    {
      fcstTime: "1200",
      PTY: "0",
      REH: "0",
      TMP: "0",
      POP: "0",
      WSD: "0",
    },
    {
      fcstTime: "1800",
      PTY: "0",
      REH: "0",
      TMP: "0",
      POP: "0",
      WSD: "0",
    },
    {
      fcstTime: "0000",
      PTY: "0",
      REH: "0",
      TMP: "0",
      POP: "0",
      WSD: "0",
    },
  ];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < weatherMap.length; j++) {
      if (weatherMap[j].fcstTime === data[i].fcstTime) {
        weatherMap[j][data[i].category] = data[i].fcstValue.toString();
      }
    }
  }
  return weatherMap;
};

const WeatherCard = () => {
  const [weather, setWeather] = useState<WeatherProps[]>([]);
  const nowStep = Math.floor(dayjs().hour() / 6) - 1;
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  useEffect(() => {
    const fetchLocation = async () => {
      sendToNative("getLocation", {}, (data: any) => {
        console.log(`hello`);
        console.log(data);
        setLocation({ latitude: data.latitude, longitude: data.longitude });
      });
    };
    fetchLocation();
  }, []);
  useEffect(() => {
    if (!location) return;
    const fetchWeather = async () => {
      try {
        const { nx, ny } = dfs_xy_conv(location.latitude, location.longitude);
        //console.log(`nx: ${nx}, ny: ${ny}`);
        const items = await api.getWeather(dayjs().format("YYYYMMDD"), nx, ny);
        //const data = await response.json();
        console.log(`날씨 items : ${items.length}`);
        if (!items || !Array.isArray(items)) {
          console.error("API에서 받은 데이터가 배열이 아닙니다:", items);
          return;
        }
        console.log(items[0]);
        setWeather(
          items.filter(
            (item: WeatherProps) =>
              Number(item.fcstValue) &&
              Number(item.fcstValue) > -998 &&
              Number(item.fcstValue) < 998
          )
        );
      } catch (err) {
        console.error("Failed to fetch weather data:");
      }
    };
    fetchWeather();
  }, [location]);
  return (
    <Flex vertical>
      {weather.length === 0 ? (
        <></>
      ) : (
        <>
          <Title name="하루 날씨" level={3} />

          <Flex
            vertical
            style={{
              backgroundColor: colors.lightGray,
              borderRadius: 10,
              padding: "10px 5px",
            }}
            title="날씨"
          >
            <Flex style={{ justifyContent: "space-between" }}>
              {filterWeatherData(weather).map((item, index) => (
                <Flex
                  key={index}
                  vertical
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  {/* 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4), 빗방울(5), 빗방울/눈날림(6), 눈날림(7) */}
                  <Image
                    src={getWeatherImage(item.PTY)}
                    width={40}
                    height={40}
                    fit="fill"
                  />
                  <>
                    <Row>
                      <Col>
                        <BsThermometerHalf size={12} />
                        <Label
                          name={item.TMP + "°C"}
                          style={{ fontSize: 12 }}
                          placeholder
                        />
                      </Col>
                      <Col>
                        <IoWaterOutline size={12} />
                        <Label
                          name={item.REH + "%"}
                          style={{ fontSize: 12 }}
                          placeholder
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FiCloudRain size={12} />
                        <Label
                          name={item.POP + "%"}
                          style={{ fontSize: 12 }}
                          placeholder
                        />
                      </Col>
                      <Col>
                        <FaWind size={12} />
                        <Label
                          name={item.WSD + "m/s"}
                          style={{ fontSize: 12 }}
                          placeholder
                        />
                      </Col>
                    </Row>
                  </>
                </Flex>
              ))}
            </Flex>
            <Steps current={nowStep}>
              <Step title="오전6시" />
              <Step title="오후12시" />
              <Step title="오후6시" />
              <Step title="오전12시" />
            </Steps>
          </Flex>
        </>
      )}
    </Flex>
  );
};

function dfs_xy_conv(v1: number, v2: number) {
  const RE = 6371.00877; // 지구 반경(km)
  const GRID = 5.0; // 격자 간격(km)
  const SLAT1 = 30.0; // 투영 위도1(degree)
  const SLAT2 = 60.0; // 투영 위도2(degree)
  const OLON = 126.0; // 기준점 경도(degree)
  const OLAT = 38.0; // 기준점 위도(degree)
  const XO = 43; // 기준점 X좌표(GRID)
  const YO = 136; // 기1준점 Y좌표(GRID)
  const DEGRAD = Math.PI / 180.0;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  let ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = v2 * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;
  return {
    nx: Math.floor(ra * Math.sin(theta) + XO + 0.5),
    ny: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5),
  };
}

export default WeatherCard;
