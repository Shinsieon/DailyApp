import { Flex, Statistic, StatisticProps } from "antd";
import AppHeader from "../components/AppHeader";
import { Divider } from "antd-mobile";
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

const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp end={value as number} separator="," />
);

const MyPage = () => {
  const user = useUserStore((state) => state.user);
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
