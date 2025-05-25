import { Flex, message } from "antd";
import { useBudgetStore } from "../store/budgetStore";
import Label from "../components/Label";
import { Button, Divider, Segmented } from "antd-mobile";
import { BudgetType } from "../types";
import { useState } from "react";
import { colors } from "../colors";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "../utils";
import { DeleteOutline } from "antd-mobile-icons";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useBudgetUIStore } from "../store/budgetUIStore";

interface DetailBudgetProps {
  handleComplete?: () => void;
}

const DetailBudget = (props: DetailBudgetProps) => {
  const { selDate } = useBudgetUIStore();
  const { budgets, deleteBudget } = useBudgetStore();
  const dailyBudget = budgets.filter((budget) => budget.date === selDate);
  const [selTab, setSelTab] = useState<BudgetType>("all");
  const navigate = useNavigate();
  return (
    <Flex vertical style={{ padding: 20, width: "100%" }} gap={10}>
      <Flex justify="space-between" align="center">
        <Segmented
          options={[
            { label: "전체", value: "all" },

            { label: "수입", value: "income" },
            { label: "지출", value: "expense" },
          ]}
          value={selTab}
          onChange={(value) => {
            setSelTab(value as BudgetType);
          }}
        />
        <Flex gap={5}>
          <Button
            style={{
              backgroundColor: colors.lightPrimary,
              fontSize: 12,
              color: colors.primary,
            }}
            onClick={() => {
              navigate("/budgetEditPage", {
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
              navigate("/budgetEditPage", {
                state: {
                  date: selDate,
                  type: "expense",
                },
              });
            }}
          >
            <MinusOutlined />
            새로운 지출
          </Button>
        </Flex>
      </Flex>
      <Flex vertical gap={10}>
        {dailyBudget
          .filter((b) => selTab === "all" || b.type === selTab)
          .map((budget) => (
            <Flex
              align="center"
              justify="space-between"
              style={{
                backgroundColor: colors.lighterGray,
                borderRadius: 10,
                border: `none`,
              }}
              key={budget.id}
              onClick={() => {
                navigate("/budgetEditPage", {
                  state: { budgetId: budget.id },
                });
              }}
            >
              <Flex
                style={{
                  backgroundColor:
                    budget.type === "income"
                      ? colors.lightPrimary
                      : colors.lightTomato,
                  padding: 10,
                  borderRadius: "10px 0 0 10px",
                }}
                align="center"
              >
                <Label
                  name={budget.type === "income" ? "수입" : "지출"}
                  style={{
                    color:
                      budget.type === "income"
                        ? colors.primary
                        : colors.lightWhite,
                  }}
                />
              </Flex>
              <Flex style={{ padding: 10, flex: 1 }} align="center">
                <Label name={budget.category.label} />
                <Divider direction="vertical" />
                <Label name={formatMoney(budget.amount) + "원"} />

                {budget.other && (
                  <>
                    <Divider direction="vertical" />
                    <Label name={budget.other} placeholder />
                  </>
                )}
              </Flex>
              <Flex
                style={{
                  height: "100%",
                }}
              >
                <Button
                  style={{
                    border: "none",
                    backgroundColor: colors.darkBlue,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBudget(budget.id!);
                    message.success(
                      budget.type === "income"
                        ? "수입이 삭제되었습니다."
                        : "지출이 삭제되었습니다."
                    );
                  }}
                >
                  <DeleteOutline color={colors.lightWhite} />
                </Button>
              </Flex>
            </Flex>
          ))}
      </Flex>
    </Flex>
  );
};
export default DetailBudget;
