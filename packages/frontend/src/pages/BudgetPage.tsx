import { Empty, Flex, message, Space } from "antd";
import AppHeader from "../components/AppHeader";
import dayjs, { ManipulateType } from "dayjs";
import { useEffect, useState } from "react";
import { BudgetData, BudgetType } from "../types";
import { formatMoney } from "../utils";
import { useBudgetStore } from "../store/budgetStore";
import { Button, List, Tabs } from "antd-mobile";
import { colors } from "../colors";
import { DeleteTwoTone, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import CustomCalendar from "../components/CustomCalendar";
import Label from "../components/Label";
import { useNavigate } from "react-router-dom";

const RenderList = (type: BudgetType, budgets: BudgetData[]) => {
  const deleteBudget = useBudgetStore((state) => state.deleteBudget);
  const navigate = useNavigate();
  return (
    <Space
      direction="vertical"
      style={{ width: "100%", height: "35vh", overflowY: "auto" }}
    >
      {budgets.length === 0 ? (
        <Empty
          style={{ color: colors.lightGray }}
          description={
            type === "income"
              ? "수입 데이터가 없습니다"
              : "지출 데이터가 없습니다"
          }
        />
      ) : (
        <>
          <List key={"budgetlist"}>
            {budgets.map((budget) => (
              <List.Item
                key={budget.id}
                arrowIcon={<></>}
                extra={
                  <DeleteTwoTone
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBudget(budget.id!);
                      message.success(
                        type === "income"
                          ? "수입이 삭제되었습니다."
                          : "지출이 삭제되었습니다."
                      );
                    }}
                  />
                }
                onClick={() => {
                  navigate("/editBudget", {
                    state: { budgetId: budget.id },
                  });
                }}
              >
                {budget.category.label +
                  " " +
                  formatMoney(budget.amount) +
                  "원"}
              </List.Item>
            ))}
          </List>
        </>
      )}
    </Space>
  );
};

const BudgetPage = () => {
  const [selDate, setSelDate] = useState<string>(dayjs().format("YYYYMMDD"));
  const [selTab, setSelTab] = useState<BudgetType>("income");
  const [dayType, setDayType] = useState<ManipulateType>("day");
  const navigate = useNavigate();
  const budget = useBudgetStore((state) => state.budgets);
  const incomes = budget.filter(
    (item) => item.type === "income" && item.date === selDate
  );
  const expenses = budget.filter(
    (item) => item.type === "expense" && item.date === selDate
  );

  return (
    <Flex vertical style={{ height: "100vh" }}>
      {/* 100vh 지우지말것 */}
      <AppHeader title="가계부 정리" />
      <Flex vertical style={{ flex: 1, overflowY: "auto" }}>
        <CustomCalendar
          selDate={selDate}
          checkDates={budget.map((bd) => bd.date)}
          onClick={(date) => {
            console.log("seldate changed!");
            setSelDate(date);
          }}
          onTypeChange={(type) => {
            setDayType(type);
          }}
        />
        <Flex vertical style={{ padding: "0 20px" }}>
          <Flex justify="between" align="center">
            <Flex vertical style={{ flex: 1 }}>
              <Label
                style={{ fontSize: 30, fontWeight: "bold" }}
                name={dayType === "day" ? "Daily Budgets" : "Monthly Budgets"}
              />
              <Label
                name={
                  dayType === "day"
                    ? dayjs(selDate).format("YYYY년 MM월 DD일")
                    : dayjs(selDate).format("YYYY년 MM월")
                }
                placeholder
              />
            </Flex>
            <Flex vertical gap={2}>
              <Button
                style={{
                  backgroundColor: colors.lightPrimary,
                  fontSize: 12,
                  color: colors.primary,
                }}
                onClick={() => {
                  navigate("/editBudget", {
                    state: { date: selDate, type: "income" },
                  });
                }}
              >
                <PlusOutlined />
                새로운 수입
              </Button>
              <Button
                style={{
                  backgroundColor: colors.lightTomato,
                  fontSize: 12,
                  color: colors.lightWhite,
                }}
                onClick={() => {
                  navigate("/editBudget", {
                    state: { date: selDate, type: "expense" },
                  });
                }}
              >
                <MinusOutlined />
                새로운 지출
              </Button>
            </Flex>
          </Flex>
          <Tabs
            style={{ flex: 1 }}
            onChange={(tab) => {
              setSelTab(tab as BudgetType);
            }}
            activeKey={selTab}
          >
            <Tabs.Tab title="수입" key="income">
              {RenderList("income", incomes)}
            </Tabs.Tab>
            <Tabs.Tab title="지출" key="expense">
              {RenderList("expense", expenses)}
            </Tabs.Tab>
          </Tabs>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default BudgetPage;
{
  /* <Calendar
            style={{ width: "100%", position: "relative" }}
            className={
              calenderFolded === true
                ? "slideup"
                : calenderFolded === false
                  ? "slidedown"
                  : ""
            }
            fullscreen={false}
            onSelect={(date: Dayjs) => {
              setSelDate(date.format("YYYYMMDD"));
            }}
            cellRender={(props) => {
              if (budget.find((bud) => bud.date === props.format("YYYYMMDD"))) {
                return (
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      margin: "0 auto",
                    }}
                  ></div>
                );
              }
            }}
            headerRender={({ value, type, onChange }) => {
              const nowMonth = value.month();
              const monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ];
              const monthText = monthNames[nowMonth];
              return (
                <Flex
                  justify="center"
                  align="center"
                  gap={10}
                  style={{ height: "50px" }}
                >
                  <LeftCircleFilled
                    style={{ fontSize: "25px", color: "rgba(0,34,68)" }}
                    onClick={() => {
                      onChange(value.add(-1, "month"));
                    }}
                  />
                  <Typography style={{ fontSize: "25px", fontWeight: "bold" }}>
                    {monthText}
                  </Typography>
                  <RightCircleFilled
                    style={{ fontSize: "25px", color: "rgba(0,34,68)" }}
                    onClick={() => {
                      onChange(value.add(1, "month"));
                    }}
                  />
                </Flex>
              );
            }}
          /> */
}
