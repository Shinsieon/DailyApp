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
import BottomMenu from "../components/BottomMenu";
import useIsMobile from "../hooks/useIsMobile";

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
  const isMobile = useIsMobile();
  return (
    <Flex vertical>
      <Flex style={{ height: isMobile ? "90vh" : "100vh" }}>
        {selMenu.element}
      </Flex>
      {isMobile ? (
        <BottomMenu menus={menus} selMenu={selMenu} setSelMenu={setSelMenu} />
      ) : null}
    </Flex>
  );
};
export default Index;
