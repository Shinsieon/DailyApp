import { useNavigate } from "react-router-dom";
import { useTodoStore } from "../store/todoStore";
import dayjs from "dayjs";
import { colors } from "../colors";
import CardItem from "./CardItem";
import CustomCard from "./CustomCard";
import { Empty } from "antd";

const TodoCard = () => {
  const navigate = useNavigate();
  const todos = useTodoStore((state) => state.todos);

  const uncompletedTodos = todos
    .filter((td) => !td.completed && td.date >= dayjs().format("YYYYMMDD"))
    .sort((a, b) => Number(a.date) - Number(b.date));
  return (
    <CustomCard
      title="일정"
      onAddClick={() => {
        navigate("todoEditPage");
      }}
      onClick={() => {
        navigate("todoPage");
      }}
      children={
        <>
          {uncompletedTodos.map(
            (todo, index: number) =>
              index < 3 && (
                <CardItem
                  key={todo.id}
                  title={dayjs(todo.date).format("YYYY년 MM월 DD일")}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/todoEditPage", {
                      state: { todoId: todo.id },
                    });
                  }}
                  backgroundColor={colors.lightPrimary}
                  description={todo.title}
                />
              )
          )}
        </>
      }
    />
  );
};
export default TodoCard;
