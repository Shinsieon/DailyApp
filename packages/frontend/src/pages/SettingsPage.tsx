import { DeleteFilled, NotificationFilled } from "@ant-design/icons";
import { Card, List, Modal } from "antd-mobile";
import { deleteDB } from "../db/conn";
import { useTodoStore } from "../store/todoStore";
import { useMemoStore } from "../store/memoStore";
import { useBudgetStore } from "../store/budgetStore";
import { Flex, message } from "antd";
import { useNavigate } from "react-router-dom";
import { colors } from "../colors";
import { useUserStore } from "../store/userStore";

const SettingsPage = () => {
  const flushTodo = useTodoStore((state) => state.flush);
  const flushMemo = useMemoStore((state) => state.flush);
  const flushBudget = useBudgetStore((state) => state.flush);
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const navigate = useNavigate();
  return (
    <Flex
      vertical
      style={{
        width: "100%",
        padding: "0",
        gap: 10,
      }}
    >
      {user && (
        <List mode="card" header="사용자 설정">
          <List.Item
            prefix={<DeleteFilled />}
            onClick={() => {
              navigate("/change-nickname");
            }}
          >
            닉네임 변경
          </List.Item>
          <List.Item
            prefix={<NotificationFilled />}
            onClick={() => {
              clearUser();
              localStorage.removeItem("token");
              message.success("로그아웃되었습니다.");
            }}
          >
            로그아웃
          </List.Item>
        </List>
      )}

      <List mode="card" header="앱 설정">
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
    </Flex>
  );
};
export default SettingsPage;
