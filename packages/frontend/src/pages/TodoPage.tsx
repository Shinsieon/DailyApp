import { Empty, Flex, message } from "antd";
import AppHeader from "../components/AppHeader";
import { Badge, Button, Checkbox, Tabs } from "antd-mobile";
import { useState } from "react";
import dayjs, { ManipulateType } from "dayjs";
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import { useTodoStore } from "../store/todoStore";
import { TodoData } from "../types";
import CustomCalendar from "../components/CustomCalendar";
import Label from "../components/Label";
import { colors } from "../colors";
import { useNavigate } from "react-router-dom";
import { CiViewTable, CiCircleList } from "react-icons/ci";
import TimeTable from "../components/TimeTable";

type TodoMapKey = "All" | "Open" | "Closed";
type TodoMap = {
  [key in TodoMapKey]: TodoData[];
};

const TodoPage = () => {
  const [selDate, setSelDate] = useState<string>(dayjs().format("YYYYMMDD"));
  const [dayType, setDayType] = useState<ManipulateType>("day");
  const [showTimeTable, setShowTimeTable] = useState<boolean>(
    localStorage.getItem("showTimeTable") === "true"
  );
  const navigate = useNavigate();
  const { todos, deleteTodo, toggleTodo } = useTodoStore();
  const todoMap: TodoMap = {
    All: [],
    Open: [],
    Closed: [],
  };
  const tabs: TodoMapKey[] = ["All", "Open", "Closed"];
  const todayTodos = [];

  for (let i = 0; i < todos.length; i++) {
    if (dayType === "day") {
      if (todos[i].date === selDate) {
        if (todos[i].completed) {
          todoMap.Closed.push(todos[i]);
        } else {
          todoMap.Open.push(todos[i]);
        }
        todayTodos.push(todos[i]);
      }
    } else {
      if (todos[i].date.substring(0, 6) === selDate.substring(0, 6)) {
        if (todos[i].completed) {
          todoMap.Closed.push(todos[i]);
        } else {
          todoMap.Open.push(todos[i]);
        }
      }
    }
  }
  todoMap.All = Array.from([...todoMap.Open, ...todoMap.Closed]).sort(
    (a, b) => Number(a.date) - Number(b.date) || a.id! - b.id!
  );

  return (
    <Flex vertical style={{ height: "100vh" }}>
      <AppHeader title="할 일 정리" />
      <Flex vertical style={{ flex: 1, overflow: "auto" }}>
        <CustomCalendar
          selDate={selDate}
          checkDates={todos.map((todo) => todo.date)}
          onClick={(date) => {
            setSelDate(date);
          }}
          onTypeChange={(type) => {
            setDayType(type);
          }}
        />
        <Flex vertical style={{ padding: "0 20px" }}>
          <Flex justify="between" align="center">
            <Flex vertical style={{ flex: 1 }}>
              <Label
                style={{ fontSize: 30, fontWeight: "bold" }}
                name={dayType === "day" ? "Daily Tasks" : "Monthly Tasks"}
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
                  navigate("/todoEditPage", { state: { date: selDate } });
                }}
              >
                <PlusOutlined />
                새로운 할 일
              </Button>
              <Button
                style={{
                  backgroundColor: colors.darkGray,
                  fontSize: 12,
                  color: colors.lightWhite,
                }}
                onClick={() => {
                  setShowTimeTable(!showTimeTable);
                  localStorage.setItem("showTimeTable", String(!showTimeTable));
                }}
              >
                <Flex justify="center" align="center">
                  {showTimeTable ? (
                    <>
                      <CiCircleList />
                      목록
                    </>
                  ) : (
                    <>
                      <CiViewTable />
                      시간표
                    </>
                  )}
                </Flex>
              </Button>
            </Flex>
          </Flex>
          {showTimeTable ? (
            <TimeTable todos={todayTodos} />
          ) : (
            <Tabs style={{ flex: 1, marginTop: 20 }}>
              {tabs.map((tab, index) => (
                <Tabs.Tab
                  title={
                    <Badge
                      content={todoMap[tab].length}
                      style={{ "--right": "-10px", "--top": "8px" }}
                    >
                      {tab}
                    </Badge>
                  }
                  key={index}
                >
                  <Flex vertical>
                    {todoMap[tab].length === 0 ? (
                      <Empty />
                    ) : (
                      <>
                        <Flex vertical key={"todolist"} gap={10}>
                          {todoMap[tab].map((todo, index) => {
                            return (
                              <>
                                <Label
                                  name={dayjs(todo.date).format(
                                    "YYYY년 MM월 DD일"
                                  )}
                                  style={{
                                    display:
                                      index === 0
                                        ? "block"
                                        : todo.date ===
                                            todoMap[tab][index - 1].date
                                          ? "none"
                                          : "block",
                                    fontSize: 12,
                                    fontWeight: "bold",
                                  }}
                                  placeholder
                                />
                                <Flex
                                  key={index}
                                  justify="space-between"
                                  align="center"
                                  style={{
                                    padding: "20px 10px",
                                    border: "1px solid #f0f0f0",
                                    borderRadius: "20px",
                                  }}
                                  onClick={() => {
                                    navigate("/todoEditPage", {
                                      state: { todoId: todo.id },
                                    });
                                  }}
                                >
                                  <Checkbox
                                    checked={todo.completed}
                                    onChange={() => {
                                      toggleTodo(todo.id!);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {todo.title}
                                  </Checkbox>
                                  <DeleteTwoTone
                                    style={{ fontSize: 20 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteTodo(todo.id!);
                                      message.success(
                                        "할 일이 삭제되었습니다."
                                      );
                                    }}
                                  />
                                </Flex>
                              </>
                            );
                          })}
                        </Flex>
                      </>
                    )}
                  </Flex>
                </Tabs.Tab>
              ))}
            </Tabs>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default TodoPage;
