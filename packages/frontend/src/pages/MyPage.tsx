import { Flex, Statistic, StatisticProps } from "antd";
import AppHeader from "../components/AppHeader";
import { Divider, ImageUploaderRef, ImageUploadItem } from "antd-mobile";
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
import { useRef, useState } from "react";
import { CiCircleChevRight } from "react-icons/ci";

const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp end={value as number} separator="," />
);

const MyPage = () => {
  const user = useUserStore((state) => state.user);
  const memos = useMemoStore((state) => state.memos);
  const todos = useTodoStore((state) => state.todos);
  const budgets = useBudgetStore((state) => state.budgets);
  const navigate = useNavigate();
  return (
    <Flex vertical>
      <AppHeader title="마이페이지" />
      <Flex
        vertical
        style={{ flex: 1, overflowY: "auto", padding: "0px 20px" }}
      >
        <Flex style={{ height: 140 }} id="profileView">
          <Flex vertical style={{ padding: "20px 0" }} id="nameView">
            <Flex gap={10} align="center">
              <Label
                name={user?.nickname + "님"}
                style={{ fontWeight: "bold", fontSize: sizes.font.xlarge }}
              />
              <EditFilled
                style={{ fontSize: 15 }}
                onClick={() => {
                  navigate("/change-nickname");
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
          <Statistic title="할 일" formatter={formatter} value={todos.length} />
          <Divider direction="vertical" />
          <Statistic
            title="가계부"
            formatter={formatter}
            value={budgets.length}
          />
        </Flex>
        <Flex id="settingView" vertical style={{ marginTop: 20 }} gap={10}>
          <Label
            name="설정"
            style={{
              fontSize: sizes.font.large,
              fontWeight: "bold",
            }}
          />
          <Flex vertical>
            <Flex
              style={{
                backgroundColor: colors.lighterGray,
                borderRadius: 10,
                padding: 10,
              }}
              justify="space-between"
              align="center"
              onClick={() => {
                navigate("/categoryList");
              }}
            >
              <Label
                name="카테고리 변경"
                style={{
                  fontSize: sizes.font.medium,
                }}
              />
              <CiCircleChevRight style={{ fontSize: 20 }} />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MyPage;
