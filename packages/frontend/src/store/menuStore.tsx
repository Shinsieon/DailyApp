import { create } from "zustand";
import { Menu } from "../types";

import SettingsPage from "../pages/SettingsPage";
import HomePage from "../pages/HomePage";
import { FaRegUser, FaUser } from "react-icons/fa";
import MyPage from "../pages/MyPage";
import {
  IoClipboard,
  IoClipboardOutline,
  IoHomeOutline,
  IoHomeSharp,
  IoMenu,
  IoMenuOutline,
} from "react-icons/io5";
import BoardPage from "../pages/BoardPage";
import MenuPage from "../pages/MenuPage";

const menus: Menu[] = [
  {
    name: "마이",
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
  {
    name: "보드",
    path: "/board",
    icon: <IoClipboardOutline style={{ fontSize: 20 }} />,
    selIcon: <IoClipboard style={{ fontSize: 20 }} />,
    element: <BoardPage />,
  },
  // {
  //   name: "설정",
  //   path: "/settings",
  //   icon: <IoSettingsOutline style={{ fontSize: 20 }} />,
  //   selIcon: <IoSettings style={{ fontSize: 20 }} />,
  //   element: <SettingsPage />,
  // },
  {
    name: "메뉴",
    path: "/menu",
    icon: <IoMenuOutline style={{ fontSize: 20 }} />,
    selIcon: <IoMenu style={{ fontSize: 20 }} />,
    element: <MenuPage />,
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
