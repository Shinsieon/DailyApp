import { useTodoStore } from "../store/todoStore";
import { useBudgetStore } from "../store/budgetStore";
import { diaryQuestions, useDiaryStore } from "../store/diaryStore";
import { Flex, message } from "antd";
import Label from "../components/Label";
import { colors } from "../colors";
import { AiOutlineDelete } from "react-icons/ai";
import { FaCirclePlus } from "react-icons/fa6";
import sizes from "../sizes";
import { useNavigate } from "react-router-dom";
import HorizontalBarChart from "../components/BarChart";

interface DetailProps {
  selDate: string;
}
const Detail = (props: DetailProps) => {
  const { selDate } = props;
  const { todos, deleteTodo } = useTodoStore();
  const budgets = useBudgetStore((state) => state.budgets);
  const diary = useDiaryStore((state) => state.diary);
  const navigate = useNavigate();
  const todo = todos.filter((todo) => {
    if (!todo.endDate) {
      return todo.date === selDate;
    }
    return (
      todo.date &&
      todo.date <= selDate &&
      todo.endDate &&
      todo.endDate >= selDate
    );
  });
  const budget = budgets.filter((budget) => budget.date === selDate);
  const incomeSum = budget
    .filter((b) => b.type === "income")
    .reduce((acc, b) => acc + b.amount, 0);
  const expenseSum = budget
    .filter((b) => b.type === "expense")
    .reduce((acc, b) => acc + b.amount, 0);
  const diaryEntry = diary.find((entry) => entry.date === selDate);

  return (
    <Flex vertical style={{ padding: 20 }} gap={10}>
      <Flex align="center" gap={10}>
        <Label name={"일정"} style={{ fontSize: 20, fontWeight: "bold" }} />
        <FaCirclePlus
          style={{ fontSize: sizes.font.medium }}
          onClick={() => {
            navigate("/todoEditPage", { state: { date: selDate } });
          }}
        />
      </Flex>
      <Flex vertical gap={5}>
        {todo.map((t) => {
          return (
            <Flex
              justify="space-between"
              key={t.id}
              style={{
                backgroundColor: colors.lightGray,
                padding: 10,
                borderRadius: 10,
              }}
              onClick={() => {
                navigate("/todoEditPage", { state: { todoId: t.id } });
              }}
            >
              <Label
                name={t.title}
                bold
                style={{
                  fontSize: 16,
                }}
              />
              <AiOutlineDelete
                style={{ fontSize: 20 }}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTodo(t.id!);
                  message.success("일정이 삭제되었습니다.");
                }}
              />
            </Flex>
          );
        })}
      </Flex>
      <Flex align="center" gap={10}>
        <Label name={"다이어리"} style={{ fontSize: 20, fontWeight: "bold" }} />
        <FaCirclePlus
          style={{ fontSize: sizes.font.medium }}
          onClick={() => {
            navigate("/diaryEditPage", { state: { selDate: selDate } });
          }}
        />
      </Flex>
      <Flex vertical gap={5}>
        {diaryQuestions.map((question, index) => {
          return (
            <Flex key={index} vertical>
              <Label
                name={question}
                bold
                style={{
                  fontSize: 16,
                }}
              />
              <Label
                style={{
                  backgroundColor: colors.lightGray,
                  padding: 10,
                  borderRadius: 10,
                }}
                name={diaryEntry?.diaries[index].content || "답변이 없습니다."}
              />
            </Flex>
          );
        })}
      </Flex>
      <Label name={"수입/지출"} style={{ fontSize: 20, fontWeight: "bold" }} />
      <HorizontalBarChart
        height={200}
        data={[expenseSum, incomeSum]}
        labels={["지출", "수입"]}
      />
    </Flex>
  );
};

export default Detail;
