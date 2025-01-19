import { Calendar, Empty, Flex, FloatButton, message, Typography } from "antd";
import AppHeader from "../components/AppHeader";
import { Checkbox, List, Space, Tabs } from "antd-mobile";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  DeleteTwoTone,
  LeftCircleFilled,
  PlusOutlined,
  RightCircleFilled,
} from "@ant-design/icons";
import { useTodoStore } from "../store/todoStore";
import CustomPopup from "../components/CustomPopup";
import NewTodo from "../popups/NewTodo";
import { TodoData } from "../types";
import Title from "../components/Title";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";

const RenderListItem = (todo: TodoData) => {
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  return (
    <List.Item
      key={todo.id}
      prefix={
        <Checkbox
          onClick={() => {
            console.log(todo.id);
            toggleTodo(todo.id!);
          }}
        />
      }
      extra={
        <DeleteTwoTone
          onClick={() => {
            deleteTodo(todo.id!);
            message.success("할 일이 삭제되었습니다.");
          }}
        />
      }
    >
      {todo.title}
    </List.Item>
  );
};
const RenderList = (todos: TodoData[]) => {
  return (
    <Flex vertical style={{ width: "100%", height: "35vh", overflowY: "auto" }}>
      {todos.length === 0 ? (
        <Empty description="할 일이 없습니다." />
      ) : (
        <>
          <List key={"todolist"}>
            {todos.map((todo) => (
              <RenderListItem key={todo.id} {...todo} />
            ))}
          </List>
        </>
      )}
    </Flex>
  );
};

const TodoPage = () => {
  const [selDate, setSelDate] = useState<string>(dayjs().format("YYYYMMDD"));
  const [visible, setVisible] = useState(false);
  const isDarkMode = useThemeStore((state) => state.theme.isDarkMode);
  const todos = useTodoStore((state) => state.todos);
  const notCompletedTodos = todos.filter(
    (todo) => !todo.completed && todo.date === selDate
  );
  const completedTodos = todos.filter(
    (todo) => todo.completed && todo.date === selDate
  );
  console.log(`length : ${completedTodos.length}`);

  return (
    <>
      <AppHeader title="할 일 정리" />
      <Flex vertical style={{ height: "100vh", overflowY: "auto" }}>
        <Flex
          style={{
            height: "45vh",
            backgroundColor: isDarkMode ? colors.lightGray : colors.darkBlue,
            borderEndStartRadius: "20px",
            borderEndEndRadius: "20px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Calendar
            style={{ width: "100%" }}
            fullscreen={false}
            onSelect={(date: Dayjs) => {
              setSelDate(date.format("YYYYMMDD"));
            }}
            headerRender={({ value, type, onChange }) => {
              console.log(value, type);
              const nowMonth = value.month();
              const monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ];
              const monthText = monthNames[nowMonth];
              return (
                <Flex
                  justify="center"
                  align="center"
                  gap={10}
                  style={{ height: "50px" }}
                >
                  <LeftCircleFilled
                    style={{ fontSize: "25px", color: "rgba(0,34,68)" }}
                    onClick={() => {
                      onChange(value.add(-1, "month"));
                    }}
                  />
                  <Typography style={{ fontSize: "25px", fontWeight: "bold" }}>
                    {monthText}
                  </Typography>
                  <RightCircleFilled
                    style={{ fontSize: "25px", color: "rgba(0,34,68)" }}
                    onClick={() => {
                      onChange(value.add(1, "month"));
                    }}
                  />
                </Flex>
              );
            }}
          />
        </Flex>
        <Space style={{ padding: "0 20px" }}>
          <Title
            level={3}
            name={
              selDate.substring(0, 4) +
              "년 " +
              selDate.substring(4, 6) +
              "월 " +
              selDate.substring(6) +
              "일"
            }
          />
        </Space>
        <Tabs>
          <Tabs.Tab title="Todo" key="Todo">
            {RenderList(notCompletedTodos)}
          </Tabs.Tab>
          <Tabs.Tab title="Done" key="Done">
            {RenderList(completedTodos)}
          </Tabs.Tab>
        </Tabs>
        <FloatButton
          style={{ width: "40px", height: "40px" }}
          icon={<PlusOutlined />}
          onClick={() => {
            setVisible(true);
          }}
        />
        <CustomPopup
          title="할 일 기록"
          height="30vh"
          visible={visible}
          setVisible={setVisible}
          children={
            <NewTodo
              onOk={() => {
                setVisible(false);
              }}
            />
          }
        />
      </Flex>
    </>
  );
};
export default TodoPage;
