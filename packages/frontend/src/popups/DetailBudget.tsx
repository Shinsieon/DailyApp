import { BudgetData, BudgetSum } from "../types";
import { List, Modal, Space, Tag } from "antd-mobile";
import { formatMoney } from "../utils";
import { Divider, Flex, message } from "antd";
import { DeleteFilled, PlusCircleFilled } from "@ant-design/icons";
import { useBudgetStore } from "../store/budgetStore";
import { useEffect, useState } from "react";
import CustomPopup from "../components/CustomPopup";
import NewBudget from "./NewBudget";
import Label from "../components/Label";
import CustomCard from "../components/Card";

const DetailBudget = ({
  date,
  budgets,
}: {
  date: string;
  budgets: BudgetData[];
}) => {
  const deleteBudget = useBudgetStore((state) => state.deleteBudget);
  const [expenseVisible, setExpenseVisible] = useState(false);
  const [incomeVisible, setIncomeVisible] = useState(false);
  const [budgetSum, setBudgetSum] = useState<BudgetSum>({
    income: 0,
    expense: 0,
  });
  useEffect(() => {
    const budgetSum: BudgetSum = { income: 0, expense: 0 };
    budgets.forEach(({ type, amount }) => {
      budgetSum[type] = (budgetSum[type] || 0) + amount;
    });
    setBudgetSum(budgetSum);
  }, [budgets]);
  return (
    <Flex vertical>
      <List style={{ overflowY: "auto" }}>
        {budgets.map((item) => (
          <List.Item key={item.id}>
            <CustomCard
              title={
                <Space>
                  <Tag
                    color={item.type === "income" ? "primary" : "danger"}
                    fill="outline"
                  >
                    {item.type === "income" ? "수입" : "지출"}
                  </Tag>
                  <Label
                    name={
                      item.category.label +
                      " " +
                      formatMoney(item.amount) +
                      "원"
                    }
                  />
                </Space>
              }
              extra={
                <DeleteFilled
                  onClick={() => {
                    Modal.confirm({
                      content: "정말 삭제하시겠습니까?",
                      confirmText: "확인",
                      onConfirm: async () => {
                        await deleteBudget(item.id!);
                        message.success("삭제되었습니다.");
                      },
                      cancelText: "취소",
                    });
                  }}
                />
              }
            ></CustomCard>
          </List.Item>
        ))}
      </List>

      <Flex
        justify="center"
        style={{
          padding: "10px",
          position: "fixed",
          bottom: 0,
          height: "5vh",
          border: "1px solid #f0f0f0",
          width: "100%",
        }}
      >
        <Label name={`총 수입: ${formatMoney(budgetSum["income"] || 0)} 원`} />

        <PlusCircleFilled
          style={{ fontSize: 15, marginLeft: 10 }}
          onClick={() => {
            setIncomeVisible(true);
          }}
        />
        <Divider type="vertical" />
        <Label name={`총 지출: ${formatMoney(budgetSum["expense"] || 0)} 원`} />
        <PlusCircleFilled
          style={{ fontSize: 15, marginLeft: 10 }}
          onClick={() => {
            setExpenseVisible(true);
          }}
        />
        <Divider type="vertical" />
      </Flex>
      <CustomPopup
        title="지출 기록"
        height="40vh"
        visible={expenseVisible}
        setVisible={setExpenseVisible}
        children={
          <NewBudget
            type="expense"
            date={date}
            onOk={() => {
              setExpenseVisible(false);
            }}
          />
        }
      />
      <CustomPopup
        title="수입 기록"
        height="40vh"
        visible={incomeVisible}
        setVisible={setIncomeVisible}
        children={
          <NewBudget
            type="income"
            date={date}
            onOk={() => {
              setIncomeVisible(false);
            }}
          />
        }
      />
    </Flex>
  );
};
export default DetailBudget;
