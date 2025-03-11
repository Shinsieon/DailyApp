import {
  BellFilled,
  DeleteOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  NotificationOutlined,
  SyncOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { List, Modal, NoticeBar, Switch } from "antd-mobile";
import { useTodoStore } from "../store/todoStore";
import { useMemoStore } from "../store/memoStore";
import { useBudgetStore } from "../store/budgetStore";
import { Flex, message } from "antd";
import { useNavigate } from "react-router-dom";
import { colors } from "../colors";
import { useUserStore } from "../store/userStore";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api, showError } from "../api";
import CustomLoading from "../components/Loading";
import Label from "../components/Label";
import { UserCircleOutline } from "antd-mobile-icons";
import { sendToNative } from "../hooks/useNative";
import useGranted from "../hooks/useGranted";

const SettingsPage = () => {
  const { memos, flushMemos, setMemos } = useMemoStore();
  const { budgets, flushBudgets, setBudgets } = useBudgetStore();
  const { todos, flushTodos, setTodos } = useTodoStore();

  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const clearUser = useUserStore((state) => state.clearUser);
  const [syncDb, setSyncDb] = useState(localStorage.getItem("syncDb") || "");
  const [appVersion, setAppVersion] = useState("");
  const [acceptPush, setAcceptPush] = useState(false);
  const navigate = useNavigate();
  const isGranted = useGranted();

  useEffect(() => {
    sendToNative("getAppVersion", {}, (data: any) => {
      console.log(`appVersion: ${data.appVersion}`);
      setAppVersion(data.appVersion);
    });
    if (isGranted.isNativeGranted && isGranted.isServerGranted) {
      setAcceptPush(true);
    }
  }, []);

  const handleNotiToggle = async (value: boolean) => {
    if (!user) {
      message.error("로그인 후 사용해주세요.");
      return;
    }
    if (value) {
      if (!isGranted.isNativeGranted) {
        message.info("알림을 허용해주세요.", 1, () => {
          sendToNative("goToSettings", {}, (data: any) => {
            console.log(data);
          });
        });
        return;
      }
    }
    sendToNative("getFCMToken", {}, async (data: any) => {
      console.log(`fcmToken: ${data.fcmToken}`);
      const deviceId = data.fcmToken;
      const result = await api.setNotificationGranted(user.id, deviceId, value);
      if (result) {
        setAcceptPush(value);
      } else {
        message.error("알림 설정에 실패했습니다.");
      }
      message.success("알림 설정이 변경되었습니다.");
    });
  };

  return (
    <Flex
      vertical
      style={{
        width: "100%",
        padding: "0",
        gap: 10,
      }}
    >
      <List mode="card" header="사용자 설정">
        {user ? (
          <>
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
          </>
        ) : (
          <>
            <List.Item
              prefix={<UserCircleOutline />}
              onClick={() => {
                navigate("/login");
              }}
            >
              로그인
            </List.Item>
          </>
        )}
      </List>

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
        <List.Item prefix={<InfoCircleOutlined />} extra={appVersion}>
          앱 버전
        </List.Item>
      </List>
      <List mode="card" header="알림 설정">
        <List.Item
          prefix={<BellFilled />}
          extra={<Switch checked={acceptPush} onChange={handleNotiToggle} />}
        >
          앱 푸시
        </List.Item>
      </List>
      {loading && <CustomLoading />}
    </Flex>
  );
};
export default SettingsPage;
