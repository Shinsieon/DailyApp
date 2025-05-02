import { Calendar, Flex } from "antd";
import AppHeader from "../components/AppHeader";
import dayjs, { Dayjs } from "dayjs";
import { useTodoStore } from "../store/todoStore";
import sizes from "../sizes";
import Label from "../components/Label";
import CustomPopup from "../components/CustomPopup";
import Detail from "../popups/Detail";
import { useEffect, useRef, useState } from "react";
import { SelectInfo } from "antd/es/calendar/generateCalendar";
import { useBudgetStore } from "../store/budgetStore";
import { formatMoney } from "../utils";
import { colors } from "../colors";
import { Button, Segmented } from "antd-mobile";

const colorArr = ["#C70D3A", "#ED5107", "#230338", "#02383C"];

const BoardPage = () => {
  const todos = useTodoStore((state) => state.todos);
  const budgets = useBudgetStore((state) => state.budgets);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selDate, setSelDate] = useState<string>(dayjs().format("YYYYMMDD"));
  const [selType, setSelType] = useState<"month" | "year">("month");
  const yearScrollRef = useRef<HTMLDivElement>(null);
  const monthScrollRef = useRef<HTMLDivElement>(null);

  const [months, setMonths] = useState<string[]>(
    Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))
  );
  const beforeYears = Array.from({ length: 20 }, (_, i) =>
    dayjs(selDate).subtract(i, "year").format("YYYY")
  );
  const afterYears = Array.from({ length: 20 }, (_, i) =>
    dayjs(selDate)
      .add(i + 1, "year")
      .format("YYYY")
  );
  const [years, setYears] = useState<string[]>(
    beforeYears.reverse().concat(afterYears)
  );

  useEffect(() => {
    const scrollRef = selType === "year" ? yearScrollRef : monthScrollRef;
    if (scrollRef.current) {
      const todayIndex =
        selType === "year"
          ? years.indexOf(dayjs(selDate).format("YYYY"))
          : months.indexOf(dayjs(selDate).format("MM"));
      if (todayIndex !== -1) {
        const itemWidth = 60;
        scrollRef.current.scrollTo({
          left:
            todayIndex * itemWidth -
            scrollRef.current.clientWidth / 2 +
            itemWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [selType]);

  const renderTodo = (date: Dayjs, info: any) => {
    if (info.type === "date") {
      return renderTodoForDate(date);
    } else if (info.type === "month") {
      return renderTodoForMonth(date);
    }
  };
  const renderTodoForMonth = (date: Dayjs) => {
    const monthlyTodoLength = todos.filter((todo) => {
      if (!todo.endDate) {
        // 종료일이 없으면 하루짜리 투두로 처리
        return date.isSame(todo.date, "day");
      }

      // 종료일이 있다면 범위 안에 포함되는지 확인
      return (
        date.isSame(todo.date, "day") ||
        date.isSame(todo.endDate, "day") ||
        (date.isAfter(todo.date, "day") && date.isBefore(todo.endDate, "day"))
      );
    }).length;
    const monthlyBudget = budgets.filter((budget) => {
      return (
        date.isSame(dayjs(budget.date), "month") &&
        budget.date.substring(0, 6) === date.format("YYYYMM")
      );
    });
    const monthlyIncomeSum = monthlyBudget
      .filter((b) => b.type === "income")
      .reduce((acc, b) => acc + b.amount, 0);
    const monthlyExpenseSum = monthlyBudget
      .filter((b) => b.type === "expense")
      .reduce((acc, b) => acc + b.amount, 0);
    return (
      <Flex vertical gap={5}>
        <Label
          name={`일정 ${monthlyTodoLength}`}
          style={{ fontSize: sizes.font.medium, fontWeight: "bold" }}
        />
        <Label
          name={`수입 ${formatMoney(monthlyIncomeSum)}원`}
          style={{
            fontSize: sizes.font.small,
            borderLeft: `4px solid ${colors.lightTomato}`,
            paddingLeft: 10,
          }}
        />
        <Label
          name={`지출 ${formatMoney(monthlyExpenseSum)}원`}
          style={{
            fontSize: sizes.font.small,
            borderLeft: `4px solid ${colors.lightPrimary}`,
            paddingLeft: 10,
          }}
        />
      </Flex>
    );
  };
  const renderTodoForDate = (date: Dayjs) => {
    // 해당 날짜에 포함된 todo 리스트 필터링
    const matchedTodos = todos
      .filter((todo) => {
        if (!todo.endDate) {
          // 종료일이 없으면 하루짜리 투두로 처리
          return date.isSame(todo.date, "day");
        }

        // 종료일이 있다면 범위 안에 포함되는지 확인
        return (
          date.isSame(todo.date, "day") ||
          date.isSame(todo.endDate, "day") ||
          (date.isAfter(todo.date, "day") && date.isBefore(todo.endDate, "day"))
        );
      })
      .sort((a, b) => {
        const aLength = a.endDate ? dayjs(a.endDate).diff(a.date, "day") : 0;
        const bLength = b.endDate ? dayjs(b.endDate).diff(b.date, "day") : 0;
        return bLength - aLength;
      });
    matchedTodos.length = 3;

    return (
      <Flex vertical gap={2} style={{ overflow: "hidden" }}>
        {matchedTodos.map((todo, index) => {
          const isStart = date.isSame(todo.date, "day");
          const isEnd = todo.endDate ? date.isSame(todo.endDate, "day") : false;
          const borderColor = `2px solid ${colorArr[index % colorArr.length]}`;
          return (
            <Label
              key={todo.id}
              style={{
                //backgroundColor: todoColors[index],
                borderLeft: isStart ? borderColor : "none",
                borderTop: borderColor,
                borderBottom: borderColor,
                borderRight:
                  isEnd || todo.date === todo.endDate || !todo.endDate
                    ? borderColor
                    : "none",
                //backgroundColor: colorArr[index % colorArr.length],
                borderRadius: isStart
                  ? "4px 0 0 4px"
                  : isEnd
                    ? "0 4px 4px 0"
                    : "0",
                fontSize: sizes.font.xsmall,
                textAlign: "center",
                fontWeight: "bold",
                overflow: "hidden",
              }}
              name={todo.title}
            />
          );
        })}
      </Flex>
    );
  };
  return (
    <Flex
      vertical
      style={{
        width: "100%",
      }}
    >
      <Flex
        vertical
        style={{ flex: 1, overflowY: "auto", padding: "0px 20px" }}
      >
        <Calendar
          value={dayjs(selDate)}
          onSelect={(date: Dayjs, selectInfo: SelectInfo) => {
            setSelDate(date.format("YYYYMMDD"));
            if (selectInfo.source === "date") {
              setDetailVisible(true);
            }
          }}
          cellRender={renderTodo}
          headerRender={({
            value,
            type,
            onTypeChange,
            onChange,
          }: {
            value: Dayjs;
            type: "month" | "year";
            onTypeChange: (type: "month" | "year") => void;
            onChange: (date: Dayjs) => void;
          }) => {
            return (
              <Flex vertical gap={5}>
                <Segmented
                  block
                  options={["year", "month"]}
                  defaultValue={selType}
                  value={type}
                  onChange={(value) => {
                    onTypeChange(value as "month" | "year");
                    setSelType(value as "month" | "year");
                  }}
                />
                {type === "year" ? (
                  <Flex
                    gap={5}
                    style={{
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                      padding: "10px 0",
                      scrollBehavior: "smooth",
                    }}
                    ref={yearScrollRef}
                  >
                    {years.map((year, index) => {
                      const isSelected = year === dayjs(selDate).format("YYYY");
                      return (
                        <Button
                          fill="none"
                          style={{
                            color: isSelected
                              ? colors.lightWhite
                              : colors.darkGray,
                            fontSize: sizes.font.small,
                            fontWeight: "bold",
                            backgroundColor: isSelected
                              ? colors.primary
                              : colors.lightWhite,
                            width: 60,
                          }}
                          onClick={() => {
                            const newSelDate = year + selDate.substring(4);
                            setSelDate(newSelDate);
                            onChange(dayjs(newSelDate));
                          }}
                        >
                          {year}
                        </Button>
                      );
                    })}
                  </Flex>
                ) : (
                  <Flex
                    gap={5}
                    style={{
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                      padding: "10px 0",
                      scrollBehavior: "smooth",
                    }}
                    ref={monthScrollRef}
                  >
                    {months.map((month, index) => {
                      const isSelected = month === dayjs(selDate).format("MM");
                      return (
                        <Button
                          fill="none"
                          style={{
                            color: isSelected
                              ? colors.lightWhite
                              : colors.darkGray,
                            fontSize: sizes.font.small,
                            fontWeight: "bold",
                            backgroundColor: isSelected
                              ? colors.primary
                              : colors.lightWhite,
                          }}
                          onClick={() => {
                            // month를 항상 2자리 문자열로 포맷
                            const formattedMonth = Number(month)
                              .toString()
                              .padStart(2, "0");

                            // selDate 수정 (YYYY-MM-DD 형태라고 가정)
                            const newSelDate =
                              selDate.substring(0, 4) +
                              formattedMonth +
                              selDate.substring(6);

                            setSelDate(newSelDate);
                            onChange(dayjs(newSelDate));
                          }}
                        >
                          {month}
                        </Button>
                      );
                    })}
                  </Flex>
                )}
              </Flex>
            );
          }}
        />
      </Flex>
      <CustomPopup
        visible={detailVisible}
        setVisible={setDetailVisible}
        title={dayjs(selDate).format("YYYY년 MM월 DD일")}
        height="60vh"
        children={<Detail selDate={selDate} />}
      />
    </Flex>
  );
};

export default BoardPage;
