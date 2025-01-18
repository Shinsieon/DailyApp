import {
  Calendar,
  Empty,
  Flex,
  FloatButton,
  message,
  Space,
  Typography,
} from "antd";
import AppHeader from "../components/AppHeader";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { BudgetData } from "../types";
import { formatMoney } from "../utils";
import { useBudgetStore } from "../store/budgetStore";
import { List, Tabs } from "antd-mobile";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";
import {
  DeleteTwoTone,
  LeftCircleFilled,
  PlusOutlined,
  RightCircleFilled,
} from "@ant-design/icons";
import Title from "../components/Title";
import CustomPopup from "../components/CustomPopup";
import NewBudget from "../popups/NewBudget";

interface RenderListItemProps {
  budget: BudgetData;
  type: "income" | "expense";
}
const RenderListItem = ({ budget, type }: RenderListItemProps) => {
  const deleteTodo = useBudgetStore((state) => state.deleteBudget);
  return (
    <List.Item
      key={budget.id}
      extra={
        <DeleteTwoTone
          onClick={() => {
            deleteTodo(budget.id!);
            message.success(
              type === "income"
                ? "수입이 삭제되었습니다."
                : "지출이 삭제되었습니다."
            );
          }}
        />
      }
    >
      {budget.category.label + " " + formatMoney(budget.amount) + "원"}
    </List.Item>
  );
};
const RenderList = (type: "income" | "expense", budgets: BudgetData[]) => {
  return (
    <Space
      direction="vertical"
      style={{ width: "100%", height: "35vh", overflowY: "scroll" }}
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
              <RenderListItem key={budget.id} budget={budget} type={type} />
            ))}
          </List>
        </>
      )}
    </Space>
  );
};

const BudgetPage = () => {
  const [selDate, setSelDate] = useState<string>(dayjs().format("YYYYMMDD"));
  const [selTab, setSelTab] = useState<"income" | "expense">("income");
  const [visible, setVisible] = useState<boolean>(false);
  const isDarkMode = useThemeStore((state) => state.theme.isDarkMode);
  const budget = useBudgetStore((state) => state.budgets);
  const incomes = budget.filter(
    (item) => item.type === "income" && item.date === selDate
  );
  const expenses = budget.filter(
    (item) => item.type === "expense" && item.date === selDate
  );

  return (
    <Flex vertical style={{ width: "100%" }}>
      <AppHeader title="가계부" />
      {/* <Flex vertical style={{ padding: "0px 20px" }}>
        <Calendar
          fullscreen={true}
          cellRender={cellRender}
          onSelect={(date: Dayjs) => {
            setSelDate(date.format("YYYYMMDD"));
            setDetailOpen(true);
          }}
        />
        <CustomPopup
          title="상세 내역"
          visible={detailOpen}
          setVisible={setDetailOpen}
          children={
            <DetailBudget
              date={selDate}
              budgets={budget.filter((item) => item.date === selDate)}
            />
          }
        />
      </Flex> */}
      <Flex
        style={{
          height: "40%",
          backgroundColor: isDarkMode ? colors.lightGray : colors.darkBlue,
          borderEndStartRadius: "20px",
          borderEndEndRadius: "20px",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Calendar
          style={{ width: "100%" }}
          fullscreen={false}
          onSelect={(date: Dayjs) => {
            setSelDate(date.format("YYYYMMDD"));
          }}
          headerRender={({ value, type, onChange }) => {
            console.log(value, type);
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
        />
      </Flex>
      <Space style={{ padding: "0 20px" }}>
        <Title
          level={3}
          name={
            selDate.substring(0, 4) +
            "년 " +
            selDate.substring(4, 6) +
            "월 " +
            selDate.substring(6) +
            "일"
          }
        />
      </Space>
      <Tabs
        onChange={(tab) => {
          setSelTab(tab as "income" | "expense");
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
      <FloatButton
        style={{ width: "40px", height: "40px" }}
        icon={<PlusOutlined />}
        onClick={() => {
          setVisible(true);
        }}
      />
      <CustomPopup
        title={selTab === "income" ? "수입 기록" : "지출 기록"}
        height="40%"
        visible={visible}
        setVisible={setVisible}
        children={
          <NewBudget
            type={selTab}
            date={selDate}
            onOk={() => {
              setVisible(false);
            }}
          />
        }
      />
    </Flex>
  );
};
export default BudgetPage;
