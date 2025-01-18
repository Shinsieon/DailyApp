import { EditOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Space, Tag } from "antd-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FillinOutline, RightOutline } from "antd-mobile-icons";
import { useTodoStore } from "../store/todoStore";
import CustomPopup from "./CustomPopup";
import NewTodo from "../popups/NewTodo";
import dayjs from "dayjs";
import Label from "./Label";
import CustomCard from "./Card";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";

const TodoCard = () => {
  const navigate = useNavigate();
  const [todoVisible, setTodoVisible] = useState(false);
  const todos = useTodoStore((state) => state.todos);
  const isDarkMode = useThemeStore((state) => state.theme.isDarkMode);
  const todayTodos = todos.filter(
    (td) => td.date === dayjs().format("YYYYMMDD")
  );
  const uncompletedTodos = todos.filter((td) => !td.completed);
  const actions: React.ReactNode[] = [
    <EditOutlined
      key="edit"
      onClick={() => {
        setTodoVisible(true);
      }}
      style={{
        fontSize: "20px",
        color: isDarkMode ? colors.lightWhite : colors.darkBlack,
      }}
    />,
  ];
  return (
    <CustomCard
      title={
        <>
          <FillinOutline /> 할 일 정리
        </>
      }
      extra={<RightOutline onClick={() => navigate("/todo")} />}
      actions={actions}
    >
      <Flex vertical gap={5}>
        <Label name="오늘의 할 일" />
        <Space direction="horizontal">
          {todayTodos.map(
            (todo, index: number) =>
              index < 3 && (
                <Space key={todo.id}>
                  <Tag style={{ fontSize: "15px" }} color="primary">
                    {" "}
                    {todo.title}
                  </Tag>
                </Space>
              )
          )}
          {todayTodos.length > 3 ? (
            <Tag style={{ fontSize: "15px" }} color="primary">
              ...
            </Tag>
          ) : null}
        </Space>
        <Label name="아직 끝내지 못한 일" />
        <Space direction="horizontal">
          {uncompletedTodos.map(
            (todo, index: number) =>
              index < 3 && (
                <Space key={todo.id}>
                  <Tag style={{ fontSize: "15px" }} color="warning">
                    {" "}
                    {todo.title}
                  </Tag>
                </Space>
              )
          )}
          {uncompletedTodos.length > 3 ? (
            <Tag style={{ fontSize: "15px" }} color="warning">
              ...
            </Tag>
          ) : null}
        </Space>
      </Flex>
      <CustomPopup
        title="할 일 기록"
        height="35vh"
        visible={todoVisible}
        setVisible={setTodoVisible}
        children={
          <NewTodo
            onOk={() => {
              setTodoVisible(false);
            }}
          />
        }
      />
    </CustomCard>
  );
};
export default TodoCard;
