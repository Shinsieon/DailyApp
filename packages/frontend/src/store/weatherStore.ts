import { create } from "zustand";

import { WeatherProps } from "../types";

type WeatherState = {
  weather: WeatherProps[];
  setWeather: (weatherData: WeatherProps[]) => void;
};

export const useWeatherStore = create<WeatherState>((set) => ({
  weather: [],
  setWeather: (weather) => set({ weather }),
}));
