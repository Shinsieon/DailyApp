import {
  DeleteOutlined,
  LogoutOutlined,
  NotificationOutlined,
  SyncOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { List, Modal, NoticeBar } from "antd-mobile";
import { useTodoStore } from "../store/todoStore";
import { useMemoStore } from "../store/memoStore";
import { useBudgetStore } from "../store/budgetStore";
import { Flex, message } from "antd";
import { useNavigate } from "react-router-dom";
import { colors } from "../colors";
import { useUserStore } from "../store/userStore";
import { useState } from "react";
import dayjs from "dayjs";
import { api, showError } from "../api";
import CustomLoading from "../components/Loading";
import Label from "../components/Label";
import { UserCircleOutline } from "antd-mobile-icons";

const SettingsPage = () => {
  const { memos, flushMemos, setMemos } = useMemoStore();
  const { budgets, flushBudgets, setBudgets } = useBudgetStore();
  const { todos, flushTodos, setTodos } = useTodoStore();

  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const clearUser = useUserStore((state) => state.clearUser);
  const [syncDb, setSyncDb] = useState(localStorage.getItem("syncDb") || "");
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
            prefix={<UserCircleOutline />}
            onClick={() => {
              navigate("/change-nickname");
            }}
          >
            닉네임 변경
          </List.Item>
          <List.Item
            prefix={<LogoutOutlined />}
            onClick={() => {
              clearUser();
              localStorage.removeItem("token");
              message.success("로그아웃되었습니다.");
            }}
          >
            로그아웃
          </List.Item>
          <List.Item
            prefix={<UserDeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                content: "정말 탈퇴하시겠습니까?",
                confirmText: "확인",
                async onConfirm() {
                  await api.deleteProfile();
                  clearUser();
                  localStorage.removeItem("token");
                  flushMemos();
                  flushBudgets();
                  flushTodos();
                  message.success("탈퇴되었습니다.");
                },
                cancelText: "취소",
              });
            }}
          >
            계정탈퇴
          </List.Item>
        </List>
      )}

      <List mode="card" header="앱 설정">
        <List.Item
          prefix={<DeleteOutlined />}
          onClick={() => {
            Modal.confirm({
              content: "정말 초기화하시겠습니까?",
              confirmText: "확인",
              async onConfirm() {
                flushMemos();
                flushBudgets();
                flushTodos();
                message.success("데이터를 초기화했습니다.");
              },
              cancelText: "취소",
            });
          }}
        >
          데이터 초기화
        </List.Item>
        <List.Item
          prefix={<SyncOutlined />}
          onClick={async () => {
            if (!user) {
              message.error("로그인 후 사용해주세요.");
              return;
            }

            try {
              Modal.confirm({
                showCloseButton: true,
                content: "데이터 동기화를 진행하시겠습니까?",
                confirmText: "서버에서 가져오기",
                async onConfirm() {
                  setLoading(true);
                  const todos = await api.getTodos(user.id);
                  const budgets = await api.getBudgets(user.id);
                  const memos = await api.getMemos(user.id);
                  flushMemos();
                  flushBudgets();
                  flushTodos();
                  setTodos(todos);
                  setBudgets(budgets);
                  setMemos(memos);

                  const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
                  localStorage.setItem("syncDb", now);
                  setLoading(false);
                  setSyncDb(now);
                  message.success("데이터를 동기화했습니다.");
                },
                cancelText: "서버에 저장하기",
                async onCancel() {
                  setLoading(true);
                  await api.syncTodos(todos, user.id);
                  await api.syncBudgets(budgets, user.id);
                  await api.syncMemos(memos, user.id);
                  const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
                  localStorage.setItem("syncDb", now);
                  setLoading(false);
                  setSyncDb(now);
                  message.success("데이터를 동기화했습니다.");
                },
              });
            } catch (e) {
              showError("데이터 동기화에 실패했습니다.");
              setLoading(false);
            }
          }}
          extra={
            <>{syncDb && <Label name={syncDb} color={colors.primary} />}</>
          }
        >
          데이터 동기화
        </List.Item>
        <List.Item>
          <NoticeBar
            color="info"
            wrap
            bordered={false}
            content={
              "서버에 데이터를 저장하면 여러 기기에서" +
              "\n" +
              " 동일한 데이터를 사용할 수 있습니다."
            }
          />
        </List.Item>
        <List.Item
          prefix={<NotificationOutlined />}
          onClick={() => {
            navigate("/patch-note");
          }}
        >
          패치 노트
          {process.env.NODE_ENV === "development" && " (개발)"}
        </List.Item>
      </List>
      {loading && <CustomLoading />}
    </Flex>
  );
};
export default SettingsPage;
