import { PlusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { BudgetData, BudgetSum, BudgetType } from "../types";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "../utils";
import { useBudgetStore } from "../store/budgetStore";
import dayjs from "dayjs";
import { MinusCircleOutline, RightOutline } from "antd-mobile-icons";
import { colors } from "../colors";
import { Flex } from "antd";
import Label from "./Label";
import CountUp from "react-countup";

const BudgetCard = () => {
  const [todayBudget, settodayBudget] = useState<BudgetSum>({
    income: 0,
    expense: 0,
  });
  const budgets = useBudgetStore((state) => state.budgets);
  const navigate = useNavigate();

  useEffect(() => {
    const sum: BudgetSum = { income: 0, expense: 0 };
    const dayBudget = budgets.filter(
      (item) => item.date === dayjs().format("YYYYMMDD")
    );
    dayBudget.forEach((item: BudgetData) => {
      if (item.type === "income") {
        sum.income = (sum.income || 0) + item.amount;
      } else {
        sum.expense = (sum.expense || 0) + item.amount;
      }
    });
    //d.date format '2024/12/14'
    settodayBudget(sum);
    console.log(`render BudgetCard`);
  }, [budgets]);

  return (
    <Flex vertical style={{ backgroundColor: colors.lighterGray, padding: 10 }}>
      <Flex justify="space-between" style={{ marginBottom: 10 }}>
        <Label
          name="Budget"
          style={{ fontWeight: "bold", fontSize: 20 }}
          onClick={() => {
            navigate("budget");
          }}
        />
        <Flex style={{ alignItems: "center" }}>
          <RightOutline
            onClick={() => {
              navigate("budget");
            }}
            style={{
              fontSize: 15,
              padding: 5,
              borderRadius: 10,
              color: colors.lightWhite,
              backgroundColor: colors.darkGray,
            }}
          />

          <PlusCircleOutlined
            onClick={() => {
              navigate("/editBudget", {
                state: { type: "income", date: dayjs().format("YYYYMMDD") },
              });
            }}
            style={{
              fontSize: 20,
              padding: 5,
              borderRadius: 10,
              color: colors.darkBlack,
            }}
          />
          <MinusCircleOutline
            onClick={() => {
              navigate("/editBudget", {
                state: { type: "expense", date: dayjs().format("YYYYMMDD") },
              });
            }}
            style={{
              fontSize: 20,
              padding: 5,
              borderRadius: 10,
              color: colors.darkBlack,
            }}
          />
        </Flex>
      </Flex>
      <Flex vertical>
        <Flex justify="space-between">
          <Label name="수입" style={{ fontSize: 15, fontWeight: "bold" }} />
          <Flex>
            <CountUp
              start={todayBudget.income > 10 ? todayBudget.income - 10 : 0}
              end={todayBudget.income}
              formattingFn={formatMoney}
              style={{ fontSize: 15 }}
            />
            <Label name={"원"} style={{ fontSize: 15 }}></Label>
          </Flex>
        </Flex>
        <Flex justify="space-between">
          <Label name="지출" style={{ fontSize: 15, fontWeight: "bold" }} />
          <Flex>
            <CountUp
              start={todayBudget.expense > 10 ? todayBudget.expense - 10 : 0}
              end={todayBudget.expense}
              formattingFn={formatMoney}
              style={{ fontSize: 15 }}
            />
            <Label name={"원"} style={{ fontSize: 15 }}></Label>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default BudgetCard;
