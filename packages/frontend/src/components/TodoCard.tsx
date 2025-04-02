import { PlusCircleOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { useNavigate } from "react-router-dom";
import { RightOutline } from "antd-mobile-icons";
import { useTodoStore } from "../store/todoStore";
import dayjs from "dayjs";
import Label from "./Label";
import { colors } from "../colors";
import { TodoData } from "../types";

const TodoCard = () => {
  const navigate = useNavigate();
  const todos = useTodoStore((state) => state.todos);

  const uncompletedTodos = todos
    .filter((td) => !td.completed && td.date >= dayjs().format("YYYYMMDD"))
    .sort((a, b) => Number(a.date) - Number(b.date));
  console.log(`todos : ${JSON.stringify(uncompletedTodos)}`);
  return (
    <Flex vertical style={{ backgroundColor: colors.lighterGray, padding: 10 }}>
      <Flex justify="space-between" style={{ marginBottom: 10 }}>
        <Label
          name="Todo"
          style={{ fontWeight: "bold", fontSize: 20 }}
          onClick={() => {
            navigate("todoPage");
          }}
        />
        <Flex style={{ alignItems: "center" }}>
          <RightOutline
            onClick={() => {
              navigate("todoPage");
            }}
            style={{
              fontSize: 15,
              padding: 5,
              borderRadius: 10,
              color: colors.lightWhite,
              backgroundColor: colors.darkGray,
            }}
          />
          <PlusCircleOutlined
            onClick={() => {
              navigate("/todoEditPage");
            }}
            style={{
              fontSize: 20,
              padding: 5,
              borderRadius: 10,
              color: colors.darkBlack,
            }}
          />
        </Flex>
      </Flex>
      <Flex vertical gap={5}>
        {uncompletedTodos.map(
          (todo, index: number) =>
            index < 3 && <TodoItem key={todo.id} {...todo} />
        )}
      </Flex>
    </Flex>
  );
};

function TodoItem(todo: TodoData) {
  const navigate = useNavigate();
  return (
    <Flex
      style={{
        backgroundColor: colors.lightPrimary,
        padding: 10,
        borderRadius: 10,
      }}
      justify="space-between"
      align="center"
      onClick={() => {
        navigate("todoPage");
      }}
    >
      <Label
        name={todo.title}
        style={{
          fontWeight: "bold",
          fontSize: 18,
          maxWidth: 150, // 제목이 너무 길어지지 않도록 최대 너비 설정
          overflow: "hidden",
          whiteSpace: "nowrap", // 한 줄로 유지
          textOverflow: "ellipsis", // 길면 "..." 표시
        }}
      />
      <Label
        name={dayjs(todo.date).format("YYYY년 MM월 DD일")}
        style={{
          fontSize: 14,
          maxWidth: 200, // 최대 너비 설정 (조절 가능)
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
        placeholder
      />
    </Flex>
  );
}
export default TodoCard;
