import { Flex } from "antd";
import { TabBar } from "antd-mobile";
import { useMenuStore } from "../store/menuStore";

const Index = () => {
  // Load the initial menu from localStorage or default to the first menu
  const { menus, selMenu, setSelMenu } = useMenuStore();
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
          console.log(item);
          return (
            <TabBar.Item
              key={item.path}
              icon={selMenu === item ? item.selIcon : item.icon}
              title={item.name}
              onClick={() => {
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
