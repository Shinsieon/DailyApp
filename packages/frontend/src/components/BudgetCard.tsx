import { PlusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { BudgetData, BudgetSum, BudgetType } from "../types";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "../utils";
import NewBudget from "../popups/NewBudget";
import { useBudgetStore } from "../store/budgetStore";
import dayjs from "dayjs";
import CustomPopup from "./CustomPopup";
import { MinusCircleOutline, RightOutline } from "antd-mobile-icons";
import { colors } from "../colors";
import { Flex } from "antd";
import Label from "./Label";
import CountUp from "react-countup";

const BudgetCard = () => {
  const [budgetVisible, setBudgetVisible] = useState(false);
  const [todayBudget, settodayBudget] = useState<BudgetSum>({
    income: 0,
    expense: 0,
  });
  const [selType, setSelType] = useState<BudgetType>("income");

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
              setSelType("income");
              setBudgetVisible(true);
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
              setSelType("expense");
              setBudgetVisible(true);
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
              end={todayBudget.expense}
              formattingFn={formatMoney}
              style={{ fontSize: 15 }}
            />
            <Label name={"원"} style={{ fontSize: 15 }}></Label>
          </Flex>
        </Flex>
      </Flex>
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
    </Flex>
  );
};
export default BudgetCard;
