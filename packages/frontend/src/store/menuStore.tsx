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
import { colors } from "../colors";

const menus: Menu[] = [
  {
    name: "홈",
    path: "/home",
    icon: <HomeOutlined />,
    selIcon: <HomeFilled color={colors.primary} />,
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
