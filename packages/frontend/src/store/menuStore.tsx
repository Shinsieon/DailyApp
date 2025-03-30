import { create } from "zustand";
import { Menu } from "../types";

import SettingsPage from "../pages/SettingsPage";
import HomePage from "../pages/HomePage";
import { FaRegUser, FaUser } from "react-icons/fa";
import MyPage from "../pages/MyPage";
import {
  IoHomeOutline,
  IoHomeSharp,
  IoSettings,
  IoSettingsSharp,
} from "react-icons/io5";

const menus: Menu[] = [
  {
    name: "My",
    path: "/myPage",
    icon: <FaRegUser style={{ fontSize: 20 }} />,
    selIcon: <FaUser style={{ fontSize: 20 }} />,
    element: <MyPage />,
    loginNeed: true,
  },
  {
    name: "홈",
    path: "/home",
    icon: <IoHomeOutline style={{ fontSize: 20 }} />,
    selIcon: <IoHomeSharp style={{ fontSize: 20 }} />,
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
    icon: <IoSettings style={{ fontSize: 20 }} />,
    selIcon: <IoSettingsSharp style={{ fontSize: 20 }} />,
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
  selMenu: menus[1],
  setSelMenu: (menu: Menu) => set({ selMenu: menu }),
}));
