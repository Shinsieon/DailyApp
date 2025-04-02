import { Flex } from "antd";
import AppHeader from "../components/AppHeader";
import { Divider, Segmented } from "antd-mobile";
import { useEffect, useState } from "react";
import { AllowedManipulateType, BudgetData } from "../types";
import { useBudgetStore } from "../store/budgetStore";
import dayjs from "dayjs";
import Label from "../components/Label";
import { colors } from "../colors";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import DonutChart from "../components/DonutChart";
import Empty from "../components/Empty";
import LineChart from "../components/LineChart";

interface BudgetSumByCategory {
  income: { [key: string]: number };
  expense: { [key: string]: number };
}
const BudgetChartPage = () => {
  const [dayType, setDayType] = useState<AllowedManipulateType>("day");
  const budgets = useBudgetStore((state) => state.budgets);
  const [filteredBudgets, setFilteredBudgets] = useState<BudgetData[]>([]);
  const [barChartType, setBarChartType] = useState<"income" | "expense">(
    "income"
  );
  const [budgetSum, setBudgetSum] = useState({
    income: 0,
    expense: 0,
  });
  const [budgetSumByCategory, setBudgetSumByCategory] =
    useState<BudgetSumByCategory>({
      income: {},
      expense: {},
    });

  const [budgetSumByDate, setBudgetSumByDate] = useState<BudgetSumByCategory>({
    income: {},
    expense: {},
  });
  const [selDate, setSelDate] = useState<string>(dayjs().format("YYYYMMDD"));

  const handlePrevDateClick = () => {
    const prevDate = dayjs(selDate).subtract(1, dayType).format("YYYYMMDD");
    setSelDate(prevDate);
  };
  const handleNextDateClick = () => {
    const nextDate = dayjs(selDate).add(1, dayType).format("YYYYMMDD");
    setSelDate(nextDate);
  };

  useEffect(() => {
    console.log(`dayType : ${dayType} selDate : ${selDate}`);
    if (dayType === "day") {
      const todayBudgets = budgets.filter((item) => item.date === selDate);
      setFilteredBudgets(todayBudgets);
    } else if (dayType === "month") {
      const monthBudgets = budgets.filter(
        (item) => item.date.substring(0, 6) === dayjs(selDate).format("YYYYMM")
      );
      setFilteredBudgets(monthBudgets);
    } else {
      const yearBudgets = budgets.filter(
        (item) => item.date.substring(0, 4) === dayjs(selDate).format("YYYY")
      );
      setFilteredBudgets(yearBudgets);
    }
  }, [budgets, dayType, selDate]);
  useEffect(() => {
    const income = filteredBudgets
      .filter((item) => item.type === "income")
      .reduce((acc, item) => acc + item.amount, 0);
    const expense = filteredBudgets
      .filter((item) => item.type === "expense")
      .reduce((acc, item) => acc + item.amount, 0);
    setBudgetSum({
      income,
      expense,
    });
    const incomeByCategory = filteredBudgets
      .filter((item) => item.type === "income")
      .reduce(
        (acc, item) => {
          acc[item.category.label] =
            (acc[item.category.label] || 0) + item.amount;
          return acc;
        },
        {} as { [key: string]: number }
      );
    const expenseByCategory = filteredBudgets
      .filter((item) => item.type === "expense")
      .reduce(
        (acc, item) => {
          acc[item.category.label] =
            (acc[item.category.label] || 0) + item.amount;
          return acc;
        },
        {} as { [key: string]: number }
      );

    const incomeByDate = filteredBudgets
      .filter((item) => item.type === "income")
      .reduce(
        (acc, item) => {
          acc[item.date] = (acc[item.date] || 0) + item.amount;
          return acc;
        },
        {} as { [key: string]: number }
      );
    const expenseByDate = filteredBudgets
      .filter((item) => item.type === "expense")
      .reduce(
        (acc, item) => {
          acc[item.date] = (acc[item.date] || 0) + item.amount;
          return acc;
        },
        {} as { [key: string]: number }
      );
    setBudgetSumByDate({
      income: incomeByDate,
      expense: expenseByDate,
    });
    setBudgetSumByCategory({
      income: incomeByCategory,
      expense: expenseByCategory,
    });
  }, [filteredBudgets]);
  console.log(`now width : , ${window.innerWidth}`);
  return (
    <Flex vertical style={{ height: "100vh" }}>
      {/* 100vh 지우지말것 */}
      <AppHeader title="가계부 모아보기" />
      <Flex
        vertical
        style={{ flex: 1, overflowY: "auto", padding: "0px 20px" }}
        gap={10}
      >
        <Segmented
          options={[
            {
              label: "일별",
              value: "day",
            },
            {
              label: "월별",
              value: "month",
            },
            {
              label: "연도별",
              value: "year",
            },
          ]}
          block
          value={dayType}
          onChange={(value) => setDayType(value as AllowedManipulateType)}
        />
        <Flex vertical gap={20}>
          <Flex justify="center" align="center" gap={10}>
            <FaChevronCircleLeft
              style={{ fontSize: 20 }}
              onClick={handlePrevDateClick}
            />
            <Label
              name={
                dayType === "day"
                  ? dayjs(selDate).format("MM월 DD일")
                  : dayType === "month"
                    ? dayjs(selDate).format("MM월")
                    : dayjs(selDate).format("YYYY년")
              }
              placeholder
              style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}
            />
            <FaChevronCircleRight
              style={{ fontSize: 20 }}
              onClick={handleNextDateClick}
            />
          </Flex>
          <Flex
            style={{
              backgroundColor: colors.lightGray,
              padding: 30,
              borderRadius: 20,
            }}
            justify="center"
            align="center"
            gap={30}
          >
            <Flex vertical>
              <Label
                name="수입"
                style={{
                  fontSize: 15,
                  color: colors.primary,
                  textAlign: "center",
                }}
              />
              <Label
                name={budgetSum.income.toLocaleString() + "원"}
                style={{ fontSize: 20, fontWeight: "bold" }}
              />
            </Flex>
            <Divider direction="vertical" />

            <Flex vertical>
              <Label
                name="지출"
                style={{
                  fontSize: 15,
                  color: colors.lightTomato,
                  textAlign: "center",
                }}
              />
              <Label
                name={budgetSum.expense.toLocaleString() + "원"}
                style={{ fontSize: 20, fontWeight: "bold" }}
              />
            </Flex>
          </Flex>
          <Flex vertical gap={10}>
            <Label
              name="카테고리별"
              style={{ fontSize: 15, fontWeight: "bold" }}
            />
            <Segmented
              block
              value={barChartType}
              onChange={(value) =>
                setBarChartType(value as "income" | "expense")
              }
              options={[
                {
                  label: "수입",
                  value: "income",
                },
                {
                  label: "지출",
                  value: "expense",
                },
              ]}
            />

            {budgetSumByCategory[barChartType] &&
            Object.keys(budgetSumByCategory[barChartType]).length > 0 ? (
              <DonutChart
                series={Object.values(budgetSumByCategory[barChartType])}
                labels={Object.keys(budgetSumByCategory[barChartType])}
              />
            ) : (
              <Empty />
            )}
            {dayType !== "day" ? (
              <Flex vertical gap={10}>
                <Label
                  name={
                    dayType === "month" ? "일별 수입/지출" : "월별 수입/지출"
                  }
                  style={{ fontSize: 15, fontWeight: "bold" }}
                />
                <LineChart
                  series={[
                    {
                      name: "수입",
                      data:
                        Object.keys(budgetSumByDate.income).length > 0
                          ? Object.values(budgetSumByDate.income)
                          : [],
                    },
                    {
                      name: "지출",
                      data:
                        Object.keys(budgetSumByDate.expense).length > 0
                          ? Object.values(budgetSumByDate.expense)
                          : [],
                    },
                  ]}
                  labels={
                    Object.keys(budgetSumByDate[barChartType]).length > 0
                      ? Object.keys(budgetSumByDate[barChartType])
                      : []
                  }
                />
              </Flex>
            ) : (
              <></>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default BudgetChartPage;
