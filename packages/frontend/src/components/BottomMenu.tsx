import { Flex } from "antd";
import { Menu } from "../types";
import Label from "./Label";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";

const BottomMenu = ({
  menus,
  selMenu,
  setSelMenu,
}: {
  menus: Menu[];
  selMenu: Menu;
  setSelMenu: (menu: Menu) => void;
}) => {
  const theme = useThemeStore((state) => state.theme);
  return (
    <Flex
      justify="space-around"
      align="center"
      style={{
        position: "fixed",
        height: "10vh",
        width: "100%",
        bottom: 0,
        left: 0,
        fontSize: "20px",
        backgroundColor: theme.isDarkMode
          ? colors.darkBlack
          : colors.lightWhite,
        boxShadow: theme.isDarkMode
          ? "0 0 2px 0 rgba(255, 255, 255, 0.9)"
          : "0 0 5px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      {menus?.map((menu) => (
        <Flex
          key={menu.name}
          vertical
          align="center"
          onClick={() => {
            setSelMenu(menu);
          }}
          gap={5}
        >
          {menu.name === selMenu.name ? menu.selIcon : menu.icon}
          <Label name={menu.name} />
        </Flex>
      ))}
    </Flex>
  );
};

export default BottomMenu;
