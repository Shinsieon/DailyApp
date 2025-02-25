import { Flex, Progress } from "antd";
import AppHeader from "../components/AppHeader";
import Label from "../components/Label";
import { useEffect, useState } from "react";
import { WeatherMap, WeatherProps } from "../types";
import snow from "../assets/snow.png";
import rain from "../assets/rainy.png";
import cloudy from "../assets/cloudy.png";
import sun from "../assets/sun.png";
import { Image, List } from "antd-mobile";
import { colors } from "../colors";
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
const filterHourlyWeatherData = (data: WeatherProps[]) => {
  const timeArray = [
    "0500",
    "0600",
    "0700",
    "0800",
    "0900",
    "1000",
    "1100",
    "1200",
    "1300",
    "1400",
    "1500",
    "1600",
    "1700",
    "1800",
    "1900",
    "2000",
    "2100",
    "2200",
    "2300",
  ];
  const weatherMap: WeatherMap[] = timeArray.map((time) => ({
    fcstTime: time,
    PTY: "0",
    REH: "0",
    TMP: "0",
    POP: "0",
    WSD: "0",
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
const WeatherPage = () => {
  const [timeWeather, setTimeWeather] = useState<WeatherMap[]>([]);
  const weather = useWeatherStore((state) => state.weather);

  useEffect(() => {
    setTimeWeather(filterHourlyWeatherData(weather));
  }, [weather]);
  return (
    <Flex vertical style={{ height: "100vh" }}>
      <AppHeader title="하루 날씨" />
      <Flex vertical style={{ flex: 1, overflow: "auto", padding: "20px" }}>
        <Flex
          style={{ alignItems: "flex-end", margin: "5px 0px" }}
          justify="space-between"
          gap={10}
        >
          <Label
            name="기상청 단기예보 정보입니다. (발표시간 : 오전 5시)"
            placeholder
            style={{ fontSize: 12 }}
          />
        </Flex>
        {timeWeather && timeWeather.length > 0 ? (
          <>
            <List>
              {timeWeather.map((item) => (
                <Flex style={{ padding: "10px 0px" }} gap={20}>
                  <Image
                    src={getWeatherImage(item.PTY)}
                    style={{
                      width: 30,
                      height: 30,
                      padding: 10,
                      backgroundColor: colors.lighterGray,
                      borderRadius: 20,
                    }}
                  />
                  <Flex vertical>
                    <Label
                      name={item.fcstTime.substring(0, 2) + "시"}
                      placeholder
                    />
                    <Flex gap={5}>
                      <Label
                        name={`기온: ${item.TMP} °C`}
                        style={{ fontSize: 12 }}
                      />
                      <Label
                        name={`강수확률: ${item.POP}%`}
                        style={{ fontSize: 12 }}
                      />
                      <Label
                        name={`습도: ${item.REH}%`}
                        style={{ fontSize: 12 }}
                      />
                      <Label
                        name={`풍속: ${item.WSD}m/s`}
                        style={{ fontSize: 12 }}
                      />
                    </Flex>
                  </Flex>
                </Flex>
              ))}
            </List>
          </>
        ) : (
          <>
            <Flex vertical gap="middle" style={{ padding: 5 }}>
              <Progress percent={0} />
              <Label
                name="날씨 정보를 불러오는 중입니다."
                style={{ width: "100%", textAlign: "center" }}
              />
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default WeatherPage;
