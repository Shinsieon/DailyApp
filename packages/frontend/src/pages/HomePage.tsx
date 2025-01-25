import { Space } from "antd-mobile";
import BudgetCard from "../components/BudgetCard";
import TodoCard from "../components/TodoCard";
import MemoCard from "../components/MemoCard";
const HomePage = () => {
  return (
    <>
      <Space
        direction="vertical"
        style={{
          width: "100%",
          gap: "10px",
          overflowY: "scroll",
          padding: "30px 20px",
        }}
      >
        <TodoCard />
        <MemoCard />

        <BudgetCard />
      </Space>
    </>
  );
};

export default HomePage;
