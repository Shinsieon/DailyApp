import { useEffect, useState } from "react";
import { BudgetData, BudgetSum } from "../types";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "../utils";
import { useBudgetStore } from "../store/budgetStore";
import dayjs from "dayjs";
import { Flex } from "antd";
import Label from "./Label";
import CountUp from "react-countup";
import CustomCard from "./CustomCard";

const BudgetCard = () => {
  const [todayBudget, settodayBudget] = useState<BudgetSum>({
    income: 0,
    expense: 0,
    total: 0,
  });
  const budgets = useBudgetStore((state) => state.budgets);
  const navigate = useNavigate();

  useEffect(() => {
    const sum: BudgetSum = { income: 0, expense: 0, total: 0 };
    const dayBudget = budgets.filter(
      (item) => item.date === dayjs().format("YYYYMMDD")
    );
    dayBudget.forEach((item: BudgetData) => {
      if (item.type === "income") {
        sum.income = (sum.income || 0) + item.amount;
      } else {
        sum.expense = (sum.expense || 0) + item.amount;
      }
      sum.total = sum.income - sum.expense;
    });
    //d.date format '2024/12/14'
    settodayBudget(sum);
  }, [budgets]);

  return (
    <CustomCard
      title="가계부"
      onAddClick={() => {
        navigate("/budgetEditPage", {
          state: { type: "income", date: dayjs().format("YYYYMMDD") },
        });
      }}
      onClick={() => {
        navigate("budgetPage");
      }}
      children={
        <>
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
          <Flex justify="space-between">
            <Label name="합계" style={{ fontSize: 15, fontWeight: "bold" }} />
            <Flex>
              <CountUp
                start={todayBudget.total > 10 ? todayBudget.total - 10 : 0}
                end={todayBudget.total}
                formattingFn={formatMoney}
                style={{ fontSize: 15 }}
              />
              <Label name={"원"} style={{ fontSize: 15 }}></Label>
            </Flex>
          </Flex>
        </>
      }
    />
  );
};
export default BudgetCard;
