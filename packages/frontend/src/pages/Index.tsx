import {
  HomeFilled,
  HomeOutlined,
  SettingFilled,
  SettingOutlined,
} from "@ant-design/icons";
import HomePage from "./HomePage";
import SettingsPage from "./SettingsPage";
import { useState } from "react";
import { Flex } from "antd";
import { Menu } from "../types";
import { TabBar } from "antd-mobile";

const menus: Menu[] = [
  {
    name: "홈",
    path: "/home",
    icon: <HomeOutlined />,
    selIcon: <HomeFilled />,
    element: <HomePage />,
  },

  {
    name: "설정",
    path: "/settings",
    icon: <SettingOutlined />,
    selIcon: <SettingFilled />,
    element: <SettingsPage />,
  },
];
const Index = () => {
  const [selMenu, setSelMenu] = useState(menus[0]);
  return (
    <Flex vertical style={{ height: "100vh", overflow: "hidden" }}>
      <Flex style={{ flex: 1, overflowY: "auto" }}>{selMenu.element}</Flex>

      <TabBar
        style={{
          height: "60px", // Fixed height for the BottomMenu
          borderTop: "solid 1px var(--adm-color-border)",
          padding: "10px",
        }}
      >
        {menus.map((item) => (
          <TabBar.Item
            key={item.path}
            icon={item.icon}
            title={item.name}
            onClick={() => {
              setSelMenu(item);
            }}
          />
        ))}
      </TabBar>
    </Flex>
  );
};
export default Index;
