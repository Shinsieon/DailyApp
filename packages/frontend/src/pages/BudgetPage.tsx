import { Empty, Flex, message, Segmented } from "antd";
import AppHeader from "../components/AppHeader";
import dayjs, { ManipulateType } from "dayjs";
import { useEffect, useState } from "react";
import { BudgetData, BudgetType } from "../types";
import { formatMoney } from "../utils";
import { useBudgetStore } from "../store/budgetStore";
import { Button, Divider } from "antd-mobile";
import { colors } from "../colors";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import CustomCalendar from "../components/CustomCalendar";
import Label from "../components/Label";
import { useNavigate } from "react-router-dom";
import { DeleteOutline } from "antd-mobile-icons";
import { FaChartBar } from "react-icons/fa";
import { FaChartPie } from "react-icons/fa";

const BudgetPage = () => {
  const [selDate, setSelDate] = useState<string>(dayjs().format("YYYYMMDD"));
  const [selTab, setSelTab] = useState<BudgetType>("all");
  const [dayType, setDayType] = useState<ManipulateType>("day");
  const navigate = useNavigate();
  const { budgets, deleteBudget } = useBudgetStore();
  const [filteredBudgets, setFilteredBudgets] = useState<BudgetData[]>([]);
  useEffect(() => {
    const isSameDay = (date: string) => date === selDate;
    const isSameMonth = (date: string) =>
      date.substring(0, 6) === selDate.substring(0, 6);

    const filtered = budgets.filter((item) => {
      const isMatchingDate =
        dayType === "day" ? isSameDay(item.date) : isSameMonth(item.date);
      const isMatchingType = selTab === "all" || item.type === selTab;
      return isMatchingDate && isMatchingType;
    });

    setFilteredBudgets(filtered);
  }, [budgets, selTab, selDate, dayType]);

  return (
    <Flex vertical style={{ height: "100vh" }}>
      {/* 100vh 지우지말것 */}
      <AppHeader
        title="가계부 정리"
        right={
          <FaChartPie
            style={{
              fontSize: 20,
              paddingRight: 10,
            }}
            onClick={() => {
              navigate("/budgetChartPage");
            }}
          />
        }
      />
      <Flex vertical style={{ flex: 1, overflowY: "auto" }}>
        <CustomCalendar
          selDate={selDate}
          checkDates={budgets.map((bd) => bd.date)}
          onClick={(date) => {
            setSelDate(date);
          }}
          onTypeChange={(type) => {
            setDayType(type);
          }}
        />
        <Flex vertical style={{ padding: "0 20px" }} gap={20}>
          <Flex justify="between" align="center">
            <Flex vertical style={{ flex: 1 }}>
              <Label
                style={{ fontSize: 30, fontWeight: "bold" }}
                name={dayType === "day" ? "Daily Budgets" : "Monthly Budgets"}
              />
              <Label
                name={
                  dayType === "day"
                    ? dayjs(selDate).format("YYYY년 MM월 DD일")
                    : dayjs(selDate).format("YYYY년 MM월")
                }
                placeholder
              />
            </Flex>
            <Flex vertical gap={2}>
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
                    state: { date: selDate, type: "expense" },
                  });
                }}
              >
                <MinusOutlined />
                새로운 지출
              </Button>
            </Flex>
          </Flex>

          <Segmented
            block
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
          <Flex
            vertical
            style={{ width: "100%", height: "35vh", overflowY: "auto" }}
          >
            {filteredBudgets.length === 0 ? (
              <Empty style={{ color: colors.lightGray }} />
            ) : (
              <Flex vertical key={"budgetlist"} gap={8}>
                {filteredBudgets.map((budget) => (
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
                      {dayType === "month" && (
                        <>
                          <Divider direction="vertical" />
                          <Label
                            name={dayjs(budget.date).format("D일")}
                            placeholder
                          />
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
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default BudgetPage;
