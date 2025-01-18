import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { useEffect, useState } from "react";
import { BudgetData, BudgetSum } from "../types";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "../utils";
import NewBudget from "../popups/NewBudget";
import { useBudgetStore } from "../store/budgetStore";
import dayjs from "dayjs";
import CustomPopup from "./CustomPopup";
import { CollectMoneyOutline, RightOutline } from "antd-mobile-icons";
import CustomCard from "./Card";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";

const BudgetCard = () => {
  const [expenseVisible, setExpenseVisible] = useState(false);
  const [incomeVisible, setIncomeVisible] = useState(false);
  const [monthlyBudget, setmonthlyBudget] = useState<BudgetSum>({
    income: 0,
    expense: 0,
  });

  const budgets = useBudgetStore((state) => state.budgets);
  const navigate = useNavigate();
  const isDarkMode = useThemeStore((state) => state.theme.isDarkMode);

  const actions: React.ReactNode[] = [
    <MinusOutlined
      key="minusIncome"
      style={{
        fontSize: "20px",
        color: isDarkMode ? colors.lightWhite : colors.darkBlack,
      }}
      onClick={() => {
        setExpenseVisible(true);
      }}
    />,
    <PlusOutlined
      key="addIncome"
      style={{
        fontSize: "20px",
        color: isDarkMode ? colors.lightWhite : colors.darkBlack,
      }}
      onClick={() => {
        setIncomeVisible(true);
      }}
    />,
  ];
  useEffect(() => {
    console.log(budgets);
    const sum: BudgetSum = { income: 0, expense: 0 };
    const firstDayofMonth = dayjs().startOf("month").format("YYYYMMDD");
    const today = dayjs().format("YYYYMMDD");
    const monthBudget = budgets.filter(
      (item) => item.date >= firstDayofMonth && item.date <= today
    );
    monthBudget.forEach((item: BudgetData) => {
      if (item.type === "income") {
        sum.income = (sum.income || 0) + item.amount;
      } else {
        sum.expense = (sum.expense || 0) + item.amount;
      }
    });
    //d.date format '2024/12/14'
    setmonthlyBudget(sum);
    console.log(sum);
  }, [budgets]);
  return (
    <>
      <CustomCard
        title={
          <>
            <CollectMoneyOutline />
            가계부 정리
          </>
        }
        extra={<RightOutline onClick={() => navigate("/budget")} />}
        actions={actions}
      >
        <p>이번달 지출 {formatMoney(monthlyBudget.expense)}원</p>
        <p>이번달 수입 {formatMoney(monthlyBudget.income)}원</p>
      </CustomCard>
      <CustomPopup
        title="지출 기록"
        height="35vh"
        visible={expenseVisible}
        setVisible={setExpenseVisible}
        children={
          <NewBudget
            type="expense"
            onOk={() => {
              setExpenseVisible(false);
            }}
          />
        }
      />
      <CustomPopup
        title="수입 기록"
        height="35vh"
        visible={incomeVisible}
        setVisible={setIncomeVisible}
        children={
          <NewBudget
            type="income"
            onOk={() => {
              setIncomeVisible(false);
            }}
          />
        }
      />
    </>
  );
};
export default BudgetCard;
