import { create } from "zustand";
import { Menu } from "../types";
import {
  HomeFilled,
  HomeOutlined,
  SettingFilled,
  SettingOutlined,
} from "@ant-design/icons";
import SettingsPage from "../pages/SettingsPage";
import HomePage from "../pages/HomePage";

const menus: Menu[] = [
  {
    name: "홈",
    path: "/home",
    icon: <HomeOutlined style={{ fontSize: 20 }} />,
    selIcon: <HomeFilled style={{ fontSize: 20 }} />,
    element: <HomePage />,
  },

  // {
  //   name: "하루공유",
  //   path: "/share",
  //   icon: <AiOutlineWechat style={{ fontSize: 20 }} />,
  //   selIcon: <AiOutlineWechat style={{ fontSize: 20 }} />,
  //   element: <SharePage />,
  //   loginNeed: true,
  // },
  {
    name: "설정",
    path: "/settings",
    icon: <SettingOutlined style={{ fontSize: 20 }} />,
    selIcon: <SettingFilled style={{ fontSize: 20 }} />,
    element: <SettingsPage />,
  },
];

type MenuState = {
  menus: Menu[];
  selMenu: Menu;
  setSelMenu: (menu: Menu) => void;
};
export const useMenuStore = create<MenuState>((set) => ({
  menus,
  selMenu: menus[0],
  setSelMenu: (menu: Menu) => set({ selMenu: menu }),
}));
