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
import { selectModal } from "./SelectModal";

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
  }, [budgets]);

  return (
    <CustomCard
      title="가계부"
      onAddClick={() => {
        selectModal({
          title: "가계부 항목",
          question: "가계부를 추가할 항목을 선택해주세요",
          leftButtonText: "수입",
          rightButtonText: "지출",
          onLeftButtonClick: () => {
            navigate("/budgetEditPage", {
              state: { type: "income", date: dayjs().format("YYYYMMDD") },
            });
          },
          onRightButtonClick: () => {
            navigate("/budgetEditPage", {
              state: { type: "expense", date: dayjs().format("YYYYMMDD") },
            });
          },
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
        </>
      }
    />
  );
};
export default BudgetCard;
