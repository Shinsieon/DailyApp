import { useEffect, useState } from "react";
import { Flex, Progress } from "antd";
import snow from "../assets/snow.png";
import rain from "../assets/rainy.png";
import cloudy from "../assets/cloudy.png";
import sun from "../assets/sun.png";
import { Image, Segmented } from "antd-mobile";
import Label from "./Label";
import { colors } from "../colors";
import { WeatherMap, WeatherProps } from "../types";
import { useNavigate } from "react-router-dom";
import { useWeatherStore } from "../store/weatherStore";

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
  const timeArr = ["0600", "1200", "1800", "0000"];
  const weatherMap: WeatherMap[] = timeArr.map((time) => ({
    fcstTime: time,
    TMP: "0",
    REH: "0",
    POP: "0",
    WSD: "0",
    PTY: "0",
  }));
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < weatherMap.length; j++) {
      if (weatherMap[j].fcstTime === data[i].fcstTime) {
        weatherMap[j][data[i].category] = data[i].fcstValue.toString();
      }
    }
  }
  return weatherMap;
};
const timeArray = ["오전6시", "오전12시", "오후6시", "오전0시"];
const WeatherCard = () => {
  const weather = useWeatherStore((state) => state.weather);
  const [selType, setSelType] = useState<string | number>("기온");
  const [timeWeather, setTimeWeather] = useState<WeatherMap[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    setTimeWeather(filterWeatherData(weather));
  }, [weather]);
  return (
    <Flex vertical>
      <Flex
        style={{ alignItems: "flex-end", margin: "5px 0px" }}
        justify="space-between"
        gap={10}
      >
        <Label name="하루날씨" style={{ fontWeight: "bold", fontSize: 20 }} />
        <Label
          name="기상청 단기예보 정보입니다. (발표시간 : 오전 5시)"
          placeholder
          style={{ fontSize: 12 }}
        />
      </Flex>
      <Flex
        vertical
        style={{
          border: "1px solid #e8e8e8",
          borderRadius: 10,
          padding: "10px 0px",
        }}
        onClick={() => {
          navigate("weather");
        }}
      >
        {timeWeather.length === 0 ? (
          <Flex vertical gap="middle" style={{ padding: 5 }}>
            <Progress percent={0} />
            <Label
              name="날씨 정보를 불러오는 중입니다."
              style={{ width: "100%", textAlign: "center" }}
            />
          </Flex>
        ) : (
          <>
            <Flex style={{ justifyContent: "space-between", padding: 10 }}>
              {timeArray.map((item, index) => (
                <WeatherComp
                  imageSrc={getWeatherImage(timeWeather[index].PTY)}
                  TIME={item}
                  value={
                    selType === "기온"
                      ? timeWeather[index].TMP + "°C"
                      : selType === "습도"
                        ? timeWeather[index].REH + "%"
                        : selType === "강수확률"
                          ? timeWeather[index].POP + "%"
                          : selType === "풍속"
                            ? timeWeather[index].WSD + "m/s"
                            : ""
                  }
                />
              ))}
            </Flex>
            <Flex justify="center">
              <Segmented
                options={["기온", "습도", "강수확률", "풍속"]}
                value={selType}
                onChange={setSelType}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
};
interface WeatherCompProps {
  imageSrc: string;
  TIME: string;
  value: string;
}
function WeatherComp({ imageSrc, TIME, value }: WeatherCompProps) {
  return (
    <Flex vertical gap={2}>
      <Image
        src={imageSrc}
        style={{
          width: 30,
          height: 30,
          padding: 10,
          backgroundColor: colors.lighterGray,
          borderRadius: 20,
        }}
      />

      <Label
        name={TIME}
        style={{ fontSize: 12, textAlign: "center" }}
        placeholder
      />
      <Label
        name={value}
        style={{
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
        }}
      />
    </Flex>
  );
}

export default WeatherCard;
