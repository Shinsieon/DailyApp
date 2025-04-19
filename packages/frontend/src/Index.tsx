import { Flex, message } from "antd";
import { TabBar } from "antd-mobile";
import { useMenuStore } from "./store/menuStore";
import { useUserStore } from "./store/userStore";

const Index = () => {
  // Load the initial menu from localStorage or default to the first menu
  const { menus, selMenu, setSelMenu } = useMenuStore();

  const user = useUserStore((state) => state.user);

  return (
    <Flex vertical style={{ height: "100vh", overflow: "hidden" }}>
      <Flex style={{ flex: 1, overflowY: "auto" }}>{selMenu.element}</Flex>

      <TabBar
        style={{
          height: "40px", // Fixed height for the BottomMenu
          borderTop: "solid 1px var(--adm-color-border)",
          padding: "10px",
          borderRadius: "10px 10px 0 0",
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
