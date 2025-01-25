import { Button, Space } from "antd-mobile";
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
        <Button
          onClick={() => {
            if (window && window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: "review" })
              );
            }
          }}
        >
          Add
        </Button>
        <MemoCard />
        <TodoCard />
        <BudgetCard />
      </Space>
    </>
  );
};

export default HomePage;
