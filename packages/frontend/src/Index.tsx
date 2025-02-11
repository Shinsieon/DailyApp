import { Flex, message } from "antd";
import { NavBar, Space, TabBar } from "antd-mobile";
import { useMenuStore } from "./store/menuStore";
import { UserOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "./store/userStore";
import { colors } from "./colors";
import Label from "./components/Label";
import { useEffect } from "react";
import { api } from "./api";
import { useTodoStore } from "./store/todoStore";
import { useBudgetStore } from "./store/budgetStore";
import { useMemoStore } from "./store/memoStore";

const Index = () => {
  // Load the initial menu from localStorage or default to the first menu
  const { menus, selMenu, setSelMenu } = useMenuStore();
  const user = useUserStore((state) => state.user);
  const todos = useTodoStore((state) => state.todos);
  const budgets = useBudgetStore((state) => state.budgets);
  const memos = useMemoStore((state) => state.memos);
  const navigate = useNavigate();
  console.log(user);
  useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      api.getProfile().then((data) => {
        useUserStore.getState().setUser(data);
      });
    }
    if (window && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "widgetData",
          todos: todos.sort((a, b) => (a.date > b.date ? 1 : -1)),
          budgets: budgets.sort((a, b) => (a.date > b.date ? 1 : -1)),
          memos: memos.sort((a, b) => (a.date > b.date ? 1 : -1)),
        })
      );
    }
  }, [todos]);
  const right = (
    <Space style={{ fontSize: "24px" }}>
      {user ? (
        <>
          <Label name={user.nickname + "님 반갑습니다"}></Label>
          <UserOutline color={colors.primary}></UserOutline>
        </>
      ) : (
        <UserOutline
          onClick={() => {
            navigate("/login");
          }}
        />
      )}
    </Space>
  );

  // 카카오 로그인 처리
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
