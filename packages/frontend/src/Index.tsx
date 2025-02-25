import { Flex, message } from "antd";
import { TabBar } from "antd-mobile";
import { useMenuStore } from "./store/menuStore";
import { useUserStore } from "./store/userStore";
import { useEffect } from "react";
import { api } from "./api";
import { sendToNative } from "./hooks/useNative";
import { dfs_xy_conv } from "./utils";
import dayjs from "dayjs";
import { useWeatherStore } from "./store/weatherStore";
import { WeatherProps } from "./types";

const Index = () => {
  // Load the initial menu from localStorage or default to the first menu
  const { menus, selMenu, setSelMenu } = useMenuStore();

  const user = useUserStore((state) => state.user);
  const setWeather = useWeatherStore((state) => state.setWeather);
  useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      api.getProfile().then((data) => {
        useUserStore.getState().setUser(data);
      });
    }
    const fetchLocation = async () => {
      sendToNative("getLocation", {}, async (data: any) => {
        if (!data || !data.latitude || !data.longitude) {
          return;
        }
        let { nx, ny } = dfs_xy_conv(data.latitude, data.longitude);
        if (nx < 0 || ny < 0 || nx > 200 || ny > 200) {
          nx = 60;
          ny = 127;
        }
        console.log(`nx: ${nx}, ny: ${ny}`);
        const items = await api.getWeather(dayjs().format("YYYYMMDD"), nx, ny);
        //const data = await response.json();
        console.log(`날씨 items : ${items.length}`);
        if (!items || !Array.isArray(items)) {
          console.error("API에서 받은 데이터가 배열이 아닙니다:", items);
          return;
        }
        console.log(items[0]);
        const filtered = items.filter(
          (item: WeatherProps) =>
            Number(item.fcstValue) &&
            Number(item.fcstValue) > -998 &&
            Number(item.fcstValue) < 998
        );
        setWeather(filtered);
      });
    };
    fetchLocation();
  }, []);

  return (
    <Flex vertical style={{ height: "100vh", overflow: "hidden" }}>
      <Flex style={{ flex: 1, overflowY: "auto" }}>{selMenu.element}</Flex>

      <TabBar
        style={{
          height: "40px", // Fixed height for the BottomMenu
          borderTop: "solid 1px var(--adm-color-border)",
          padding: "10px",
          backgroundColor: "var(--adm-color-background)",
        }}
        safeArea
        activeKey={selMenu.path}
      >
        {menus.map((item) => {
          return (
            <TabBar.Item
              key={item.path}
              icon={selMenu === item ? item.selIcon : item.icon}
              title={item.name}
              onClick={() => {
                if (item.loginNeed && !user) {
                  message.info("로그인이 필요한 서비스입니다.");
                  return;
                }
                setSelMenu(item);
              }}
            />
          );
        })}
      </TabBar>
    </Flex>
  );
};
export default Index;
