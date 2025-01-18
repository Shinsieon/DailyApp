import { Space } from "antd-mobile";
import BudgetCard from "../components/BudgetCard";
import TodoCard from "../components/TodoCard";
import MemoCard from "../components/MemoCard";
import Title from "../components/Title";
const HomePage = () => {
  return (
    <>
      <Space
        direction="vertical"
        style={{
          width: "100%",
          gap: "10px",
          overflowY: "scroll",
          padding: "0 20px",
        }}
      >
        <Title level={4} name="하루를 정리하는데 도움을 드릴게요." />

        <TodoCard />

        <BudgetCard />
        <MemoCard />
        <Space style={{ height: "50px" }} />
      </Space>
    </>
  );
};

export default HomePage;
