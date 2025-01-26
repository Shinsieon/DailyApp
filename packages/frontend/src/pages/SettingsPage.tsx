import { DeleteFilled, NotificationFilled } from "@ant-design/icons";
import { List, Modal } from "antd-mobile";
import { deleteDB } from "../db/conn";
import { useTodoStore } from "../store/todoStore";
import { useMemoStore } from "../store/memoStore";
import { useBudgetStore } from "../store/budgetStore";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const flushTodo = useTodoStore((state) => state.flush);
  const flushMemo = useMemoStore((state) => state.flush);
  const flushBudget = useBudgetStore((state) => state.flush);
  const navigate = useNavigate();
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
          Modal.confirm({
            content:
              "삭제된 데이터는 다시 복구할 수 없습니다. 계속하시겠습니까?",
            confirmText: "확인",
            onConfirm: async () => {
              deleteDB();
              flushBudget();
              flushMemo();
              flushTodo();
              message.success("데이터가 초기화되었습니다.");
            },
            cancelText: "취소",
          });
        }}
      >
        데이터 초기화
      </List.Item>
      <List.Item
        prefix={<NotificationFilled />}
        onClick={() => {
          navigate("/patch-note");
        }}
      >
        패치 노트
      </List.Item>
    </List>
  );
};
export default SettingsPage;
