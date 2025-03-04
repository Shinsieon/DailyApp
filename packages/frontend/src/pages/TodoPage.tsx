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

type TodoMapKey = "All" | "Open" | "Closed";
type TodoMap = {
  [key in TodoMapKey]: TodoData[];
};

const TodoPage = () => {
  const [selDate, setSelDate] = useState<string>(dayjs().format("YYYYMMDD"));
  const [dayType, setDayType] = useState<ManipulateType>("day");
  const navigate = useNavigate();
  const { todos, deleteTodo, toggleTodo } = useTodoStore();
  const todoMap: TodoMap = {
    All: [],
    Open: [],
    Closed: [],
  };
  const tabs: TodoMapKey[] = ["All", "Open", "Closed"];

  for (let i = 0; i < todos.length; i++) {
    if (dayType === "day") {
      if (todos[i].date === selDate) {
        if (todos[i].completed) {
          todoMap.Closed.push(todos[i]);
        } else {
          todoMap.Open.push(todos[i]);
        }
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
    (a, b) => a.id! - b.id!
  );

  return (
    <Flex vertical style={{ height: "100vh" }}>
      <AppHeader title="할 일 정리" />
      <Flex vertical style={{ flex: 1, overflow: "auto" }}>
        <CustomCalendar
          key={todos.length}
          selDate={selDate}
          checkDates={todos.map((todo) => todo.date)}
          onClick={(date) => {
            console.log("seldate changed!");
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
                name={dayType === "day" ? "Today's Task" : "Monthly Tasks"}
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
            <Button
              style={{
                backgroundColor: colors.lightPrimary,
                height: "50px",
                color: colors.primary,
              }}
              onClick={() => {
                navigate("/editTodo");
              }}
            >
              <PlusOutlined />
              새로운 할 일
            </Button>
          </Flex>
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
                    <Empty description="데이터가 없습니다." />
                  ) : (
                    <>
                      <Flex vertical key={"todolist"} gap={10}>
                        {todoMap[tab].map((todo, index) => {
                          return (
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
                                navigate("/editTodo", {
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
                                style={{ fontSize: 18 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTodo(todo.id!);
                                  message.success("할 일이 삭제되었습니다.");
                                }}
                              />
                            </Flex>
                          );
                        })}
                      </Flex>
                    </>
                  )}
                </Flex>
              </Tabs.Tab>
            ))}
          </Tabs>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default TodoPage;
