import { Flex, message, Statistic, StatisticProps } from "antd";
import AppHeader from "../components/AppHeader";
import { Divider, Tag } from "antd-mobile";
import Label from "../components/Label";
import sizes from "../sizes";
import { useUserStore } from "../store/userStore";
import { useMemoStore } from "../store/memoStore";
import CountUp from "react-countup";
import { useTodoStore } from "../store/todoStore";
import { useBudgetStore } from "../store/budgetStore";
import { colors } from "../colors";
import { EditFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDiaryStore } from "../store/diaryStore";
import { IoLogOut } from "react-icons/io5";
const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp end={value as number} separator="," />
);

const MyPage = () => {
  const { user, clearUser } = useUserStore();
  const memos = useMemoStore((state) => state.memos);
  const todos = useTodoStore((state) => state.todos);
  const budgets = useBudgetStore((state) => state.budgets);
  const diary = useDiaryStore((state) => state.diary);
  const navigate = useNavigate();

  return (
    <Flex
      vertical
      style={{
        width: "100%",
      }}
    >
      <AppHeader title="마이페이지" />
      <Flex
        vertical
        style={{ flex: 1, overflowY: "auto", padding: "0px 20px" }}
      >
        <Flex style={{ height: 100 }} id="profileView">
          <Flex vertical style={{ padding: "20px 0" }} id="nameView">
            <Flex gap={10} align="center">
              <Label
                name={user?.nickname + "님"}
                style={{ fontWeight: "bold", fontSize: sizes.font.xlarge }}
              />
              <EditFilled
                style={{ fontSize: 15 }}
                onClick={() => {
                  navigate("/changeNicknamePage");
                }}
              />
              {user?.is_superuser && (
                <Tag
                  color="primary"
                  onClick={() => {
                    if (user?.is_superuser) {
                      navigate("/adminPage");
                    }
                  }}
                >
                  관리자
                </Tag>
              )}

              <IoLogOut
                style={{
                  fontSize: 20,
                  color: colors.error,
                  cursor: "pointer",
                }}
                onClick={() => {
                  clearUser();
                  localStorage.removeItem("token");
                  message.success("로그아웃되었습니다.");
                  navigate("/");
                }}
              />
            </Flex>
            <Label name={user?.email} />
          </Flex>
        </Flex>
        <Flex
          id="statisticView"
          justify="space-between"
          align="center"
          style={{
            backgroundColor: colors.lighterGray,
            padding: "10px 20px",
            borderRadius: 10,
          }}
        >
          <Statistic title="메모" value={memos.length} formatter={formatter} />
          <Divider direction="vertical" />
          <Statistic title="일정" formatter={formatter} value={todos.length} />
          <Divider direction="vertical" />
          <Statistic
            title="가계부"
            formatter={formatter}
            value={budgets.length}
          />
          <Divider direction="vertical" />
          <Statistic title="일기" formatter={formatter} value={diary.length} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MyPage;
