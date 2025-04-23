import { Calendar, Flex } from "antd";
import AppHeader from "../components/AppHeader";
import dayjs, { Dayjs } from "dayjs";
import { useTodoStore } from "../store/todoStore";
import sizes from "../sizes";
import { colors } from "../colors";
import Label from "../components/Label";
import CustomPopup from "../components/CustomPopup";
import Detail from "../popups/Detail";
import { useState } from "react";
import { SelectInfo } from "antd/es/calendar/generateCalendar";

const colorArr = ["#C70D3A", "#ED5107", "#230338", "#02383C"];

const BoardPage = () => {
  const todos = useTodoStore((state) => state.todos);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selDate, setSelDate] = useState<string>(dayjs().format("YYYYMMDD"));

  const renderTodoForDate = (date: Dayjs, info: any) => {
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
                  isEnd || todo.date === todo.endDate ? borderColor : "none",
                //backgroundColor: colorArr[index % colorArr.length],
                borderRadius: isStart
                  ? "4px 0 0 4px"
                  : isEnd
                    ? "0 4px 4px 0"
                    : "0",
                padding: "2px 4px",
                fontSize: sizes.font.xsmall,
                textAlign: "center",
                fontWeight: "bold",
              }}
              maxLength={3}
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
      <AppHeader title="보드" />
      <Flex
        vertical
        style={{ flex: 1, overflowY: "auto", padding: "0px 20px" }}
      >
        <Calendar
          value={dayjs(selDate)}
          onSelect={(date: Dayjs, selectInfo: SelectInfo) => {
            if (selectInfo.source === "date") {
              setSelDate(date.format("YYYYMMDD"));
              setDetailVisible(true);
            }
          }}
          cellRender={renderTodoForDate}
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
