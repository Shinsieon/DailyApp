import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { BudgetData, BudgetSum, BudgetType } from "../types";
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
  const [budgetVisible, setBudgetVisible] = useState(false);
  const [monthlyBudget, setmonthlyBudget] = useState<BudgetSum>({
    income: 0,
    expense: 0,
  });
  const [selType, setSelType] = useState<BudgetType>("income");

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
      onClick={(e) => {
        e.stopPropagation();
        setSelType("expense");
        setBudgetVisible(true);
      }}
    />,
    <PlusOutlined
      key="addIncome"
      style={{
        fontSize: "20px",
        color: isDarkMode ? colors.lightWhite : colors.darkBlack,
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelType("income");
        setBudgetVisible(true);
      }}
    />,
  ];
  useEffect(() => {
    const sum: BudgetSum = { income: 0, expense: 0 };
    const firstDayofMonth = dayjs().startOf("month").format("YYYYMMDD");
    const lastDayofMonth = dayjs().endOf("month").format("YYYYMMDD");
    const monthBudget = budgets.filter(
      (item) => item.date >= firstDayofMonth && item.date <= lastDayofMonth
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
  }, [budgets]);

  return (
    <>
      <CustomCard
        title={
          <>
            <CollectMoneyOutline /> 가계부 정리
          </>
        }
        extra={<RightOutline onClick={() => navigate("/budget")} />}
        actions={actions}
        onClick={() => navigate("/budget")}
      >
        <p>이번달 수입 {formatMoney(monthlyBudget.income)}원</p>

        <p>이번달 지출 {formatMoney(monthlyBudget.expense)}원</p>
      </CustomCard>
      <CustomPopup
        title={selType === "income" ? "수입 추가" : "지출 추가"}
        height="50%"
        visible={budgetVisible}
        setVisible={setBudgetVisible}
        children={
          <NewBudget
            type={selType}
            onOk={() => {
              setBudgetVisible(false);
            }}
          />
        }
      />
    </>
  );
};
export default BudgetCard;
