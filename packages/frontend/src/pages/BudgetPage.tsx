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
import { useEffect, useState } from "react";
import { BudgetData, BudgetType } from "../types";
import { formatMoney } from "../utils";
import { useBudgetStore } from "../store/budgetStore";
import { Button, List, Tabs } from "antd-mobile";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";
import {
  DeleteTwoTone,
  DownOutlined,
  LeftCircleFilled,
  PlusOutlined,
  RightCircleFilled,
  UpOutlined,
} from "@ant-design/icons";
import Title from "../components/Title";
import CustomPopup from "../components/CustomPopup";
import NewBudget from "../popups/NewBudget";

interface RenderListItemProps {
  budget: BudgetData;
  type: BudgetType;
  setSelItem: (budget: BudgetData) => void;
}
const RenderListItem = ({ budget, type, setSelItem }: RenderListItemProps) => {
  const deleteTodo = useBudgetStore((state) => state.deleteBudget);
  return (
    <List.Item
      key={budget.id}
      arrowIcon={<></>}
      extra={
        <DeleteTwoTone
          onClick={(e) => {
            e.stopPropagation();
            deleteTodo(budget.id!);
            message.success(
              type === "income"
                ? "수입이 삭제되었습니다."
                : "지출이 삭제되었습니다."
            );
          }}
        />
      }
      onClick={() => {
        console.log("clicked", budget);
        setSelItem({ ...budget });
      }}
    >
      {budget.category.label + " " + formatMoney(budget.amount) + "원"}
    </List.Item>
  );
};
const RenderList = (
  type: BudgetType,
  budgets: BudgetData[],
  setSelItem: (budget: BudgetData) => void
) => {
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
              <RenderListItem
                key={budget.id}
                budget={budget}
                type={type}
                setSelItem={setSelItem}
              />
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
  const [visible, setVisible] = useState<boolean>(false);
  const [selItem, setSelItem] = useState<BudgetData | null>(null);
  const [calenderFolded, setCalenderFolded] = useState<boolean | null>(null);
  const isDarkMode = useThemeStore((state) => state.theme.isDarkMode);
  const budget = useBudgetStore((state) => state.budgets);
  const incomes = budget.filter(
    (item) => item.type === "income" && item.date === selDate
  );
  const expenses = budget.filter(
    (item) => item.type === "expense" && item.date === selDate
  );

  useEffect(() => {
    if (selItem) setVisible(true);
  }, [selItem]);

  return (
    <Flex vertical style={{ height: "100vh" }}>
      <AppHeader title="가계부" />
      <Flex vertical style={{ flex: 1, overflowY: "auto" }}>
        <Flex
          vertical
          style={{
            backgroundColor: isDarkMode ? colors.lightGray : colors.darkBlue,
            borderEndStartRadius: "20px",
            borderEndEndRadius: "20px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          <Calendar
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
          />
        </Flex>
        <Flex vertical style={{ flex: 1 }}>
          <Flex
            justify="center"
            align="center"
            vertical
            style={{ height: "30px" }}
          >
            <Button
              style={{
                border: "none",
                backgroundColor: colors.lightGray,
              }}
              className="blinking-text"
              onClick={() => {
                setCalenderFolded(!calenderFolded);
              }}
            >
              {calenderFolded ? <DownOutlined /> : <UpOutlined />}
            </Button>
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
            style={{ flex: 1 }}
            onChange={(tab) => {
              setSelTab(tab as BudgetType);
            }}
            activeKey={selTab}
          >
            <Tabs.Tab title="수입" key="income">
              {RenderList("income", incomes, setSelItem)}
            </Tabs.Tab>
            <Tabs.Tab title="지출" key="expense">
              {RenderList("expense", expenses, setSelItem)}
            </Tabs.Tab>
          </Tabs>
        </Flex>
        <FloatButton
          style={{ width: "40px", height: "40px" }}
          icon={<PlusOutlined />}
          onClick={() => {
            setSelItem(null);
            setVisible(true);
          }}
        />
        <CustomPopup
          title={selTab === "income" ? "수입 기록" : "지출 기록"}
          height="50%"
          visible={visible}
          setVisible={setVisible}
          children={
            <NewBudget
              type={selTab}
              date={selDate}
              selBudget={selItem}
              onOk={() => {
                setVisible(false);
              }}
            />
          }
        />
      </Flex>
    </Flex>
  );
};
export default BudgetPage;
