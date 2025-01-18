import { DeleteFilled } from "@ant-design/icons";
import { List } from "antd-mobile";
import { deleteDB } from "../db/conn";
import { useTodoStore } from "../store/todoStore";
import { useMemoStore } from "../store/memoStore";
import { useBudgetStore } from "../store/budgetStore";
import { message } from "antd";

const SettingsPage = () => {
  const flushTodo = useTodoStore((state) => state.flush);
  const flushMemo = useMemoStore((state) => state.flush);
  const flushBudget = useBudgetStore((state) => state.flush);
  return (
    <List header="앱 설정" style={{ width: "100%" }}>
      {/* <List.Item
        style={{
          backgroundColor: isDarkMode ? colors.darkBlack : colors.lightWhite,
          borderColor: isDarkMode ? colors.lightGray : colors.darkBlack,
        }}
        prefix={isDarkMode ? <MoonOutlined /> : <SunOutlined />}
        extra={<Switch checked={isDarkMode} onChange={() => toggleTheme()} />}
      >
        다크모드/라이트모드 전환{" "}
      </List.Item> */}
      <List.Item
        prefix={<DeleteFilled />}
        onClick={() => {
          deleteDB();
          flushBudget();
          flushMemo();
          flushTodo();
          message.success("데이터가 초기화되었습니다.");
        }}
      >
        데이터 초기화
      </List.Item>
    </List>
  );
};
export default SettingsPage;
