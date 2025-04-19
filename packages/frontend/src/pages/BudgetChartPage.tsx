import { Empty, Flex } from "antd";
import AppHeader from "../components/AppHeader";
import { Segmented } from "antd-mobile";
import { useMemo, useState } from "react";
import { AllowedManipulateType, BudgetType } from "../types";
import { useBudgetStore } from "../store/budgetStore";
import dayjs from "dayjs";
import Label from "../components/Label";
import { colors } from "../colors";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import DonutChart from "../components/DonutChart";
import LineChart from "../components/LineChart";

const BudgetChartPage = () => {
  const [dayType, setDayType] = useState<AllowedManipulateType>("day");
  const [barChartType, setBarChartType] = useState<BudgetType>("income");
  const [selDate, setSelDate] = useState<string>(dayjs().format("YYYYMMDD"));

  const budgets = useBudgetStore((state) => state.budgets);

  const filteredBudgetsByCategory = useMemo(() => {
    const date = dayjs(selDate);
    if (dayType === "day") return budgets.filter((b) => b.date === selDate);
    if (dayType === "month")
      return budgets.filter((b) => b.date.startsWith(date.format("YYYYMM")));
    return budgets.filter((b) => b.date.startsWith(date.format("YYYY")));
  }, [budgets, dayType, selDate]);

  const filteredBudgetsByDate = useMemo(() => {
    const date = dayjs(selDate);
    if (dayType === "day")
      return budgets.filter((b) => b.date.startsWith(date.format("YYYYMM")));
    if (dayType === "month")
      return budgets.filter((b) => b.date.startsWith(date.format("YYYY")));
    else return budgets;
  }, [budgets, dayType, selDate]);

  const budgetSummary = useMemo(() => {
    const summary: {
      [K in BudgetType]: number;
    } & {
      byCategory: Record<BudgetType, Record<string, number>>;
      byDate: Record<BudgetType, Record<string, number>>;
    } = {
      income: 0,
      expense: 0,
      byCategory: { income: {}, expense: {} },
      byDate: { income: {}, expense: {} },
    };

    filteredBudgetsByCategory.forEach(({ type, amount, category }) => {
      summary[type as BudgetType] += amount;

      summary.byCategory[type][category.label] =
        (summary.byCategory[type][category.label] || 0) + amount;
    });
    filteredBudgetsByDate.forEach(({ type, amount, date }) => {
      if (dayType === "year") {
        date = date.substring(0, 4);
      } else if (dayType === "month") {
        date = date.substring(0, 6);
      }
      if (type === "income") {
        summary.byDate["income"][date] =
          (summary.byDate["income"][date] || 0) + amount;

        summary.byDate["expense"][date] = 0;
      } else {
        summary.byDate["expense"][date] =
          (summary.byDate["expense"][date] || 0) + amount;

        summary.byDate["income"][date] = 0;
      }
    });
    return summary;
  }, [filteredBudgetsByCategory, filteredBudgetsByDate]);

  const handleDateChange = (direction: "prev" | "next") => {
    const updatedDate = dayjs(selDate)
      .add(direction === "prev" ? -1 : 1, dayType)
      .format("YYYYMMDD");
    setSelDate(updatedDate);
  };

  const displayDate =
    dayType === "day"
      ? dayjs(selDate).format("MM월 DD일")
      : dayType === "month"
        ? dayjs(selDate).format("MM월")
        : dayjs(selDate).format("YYYY년");

  const chartData = budgetSummary.byCategory[barChartType];
  const hasChartData = Object.keys(chartData).length > 0;

  return (
    <Flex vertical style={{ height: "100vh" }}>
      <AppHeader title="가계부 모아보기" />

      <Flex
        vertical
        style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}
        gap={10}
      >
        <Segmented
          block
          value={dayType}
          options={[
            { label: "일별", value: "day" },
            { label: "월별", value: "month" },
            { label: "연도별", value: "year" },
          ]}
          onChange={(val) => setDayType(val as AllowedManipulateType)}
        />

        <Flex vertical gap={20}>
          {/* 날짜 이동 */}
          <Flex justify="center" align="center" gap={10}>
            <FaChevronCircleLeft
              style={{ fontSize: 20 }}
              onClick={() => handleDateChange("prev")}
            />
            <Label
              name={displayDate}
              placeholder
              style={{ fontSize: 20, fontWeight: "bold" }}
            />
            <FaChevronCircleRight
              style={{ fontSize: 20 }}
              onClick={() => handleDateChange("next")}
            />
          </Flex>

          {/* 요약 */}
          <Flex
            justify="center"
            align="center"
            gap={30}
            style={{
              backgroundColor: colors.lightGray,
              padding: 30,
              borderRadius: 20,
            }}
          >
            {(["income", "expense"] as const).map((type) => (
              <Flex vertical key={type} style={{ flex: 1 }}>
                <Label
                  name={type === "income" ? "수입" : "지출"}
                  style={{
                    fontSize: 15,
                    color:
                      type === "income" ? colors.primary : colors.lightTomato,
                    textAlign: "center",
                  }}
                />
                <Label
                  name={`${budgetSummary[type].toLocaleString()}원`}
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                />
              </Flex>
            ))}
          </Flex>

          {/* 카테고리 별 도넛 차트 */}
          <Flex vertical gap={10}>
            <Label
              name="카테고리별"
              style={{ fontSize: 15, fontWeight: "bold" }}
            />
            <Segmented
              block
              value={barChartType}
              onChange={(val) => setBarChartType(val as "income" | "expense")}
              options={[
                { label: "수입", value: "income" },
                { label: "지출", value: "expense" },
              ]}
            />
            {hasChartData ? (
              <DonutChart
                series={Object.values(chartData)}
                labels={Object.keys(chartData)}
              />
            ) : (
              <Empty />
            )}
          </Flex>
          <Flex vertical gap={10}>
            <Label
              name={
                dayType === "day"
                  ? "일별 수입/지출"
                  : dayType === "month"
                    ? "월별 수입/지출"
                    : "연도별 수입/지출"
              }
              style={{ fontSize: 15, fontWeight: "bold" }}
            />
            <LineChart
              series={[
                {
                  name: "수입",
                  data: Object.values(budgetSummary.byDate.income),
                },
                {
                  name: "지출",
                  data: Object.values(budgetSummary.byDate.expense),
                },
              ]}
              labels={Object.keys(budgetSummary.byDate.income).map((date) =>
                dayType === "day"
                  ? dayjs(date).format("D일")
                  : dayType === "year"
                    ? dayjs(date).format("YYYY년")
                    : dayjs(date).format("MM월")
              )}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default BudgetChartPage;
