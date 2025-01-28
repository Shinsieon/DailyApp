import { Flex } from "antd";
import { NavBar, Space, TabBar } from "antd-mobile";
import { useMenuStore } from "./store/menuStore";
import { UserOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "./store/userStore";
import { colors } from "./colors";

const Index = () => {
  // Load the initial menu from localStorage or default to the first menu
  const { menus, selMenu, setSelMenu } = useMenuStore();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  console.log(user);
  const right = (
    <Space style={{ fontSize: "24px" }}>
      {user ? (
        <UserOutline color={colors.primary}></UserOutline>
      ) : (
        <UserOutline
          onClick={() => {
            navigate("/login");
          }}
        />
      )}
    </Space>
  );
  return (
    <Flex vertical style={{ height: "100vh", overflow: "hidden" }}>
      <Flex
        vertical
        style={{
          flex: 0,
        }}
      >
        <NavBar backIcon={<></>} right={right} style={{ padding: "0 20px" }}>
          {""}
        </NavBar>
      </Flex>
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
