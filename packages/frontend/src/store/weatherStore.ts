import { create } from "zustand";

import { WeatherProps } from "../types";
import { sendToNative } from "../hooks/useNative";
import { dfs_xy_conv } from "../utils";
import { api } from "../api";
import dayjs from "dayjs";

type WeatherState = {
  weather: WeatherProps[];
  setWeather: (weatherData: WeatherProps[]) => void;
  fetchWeather: () => void;
};

export const useWeatherStore = create<WeatherState>((set) => ({
  weather: [],
  setWeather: (weather) => set({ weather }),
  fetchWeather: async () => {
    sendToNative("getLocation", {}, async (data: any) => {
      if (!data || !data.latitude || !data.longitude) {
        return;
      }
      let { nx, ny } = dfs_xy_conv(data.latitude, data.longitude);
      if (nx < 0 || ny < 0 || nx > 200 || ny > 200) {
        nx = 60;
        ny = 127;
      }
      const items = await api.getWeather(dayjs().format("YYYYMMDD"), nx, ny);
      //const data = await response.json();
      if (!items || !Array.isArray(items)) {
        console.error("API에서 받은 데이터가 배열이 아닙니다:", items);
        return;
      }
      const filtered = items.filter(
        (item: WeatherProps) =>
          Number(item.fcstValue) &&
          Number(item.fcstValue) > -998 &&
          Number(item.fcstValue) < 998
      );
      set({ weather: filtered });
    });
  },
}));
