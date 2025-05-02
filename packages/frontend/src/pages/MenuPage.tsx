import { Flex } from "antd";
import { List } from "antd-mobile";
import SettingsPage from "./SettingsPage";
import { useNavigate } from "react-router-dom";

const MenuPage = () => {
  const navigate = useNavigate();
  return (
    <Flex vertical style={{ height: "100vh", width: "100%", padding: "0" }}>
      <List mode="card" header="메모">
        <List.Item
          onClick={() => {
            navigate("/memoPage");
          }}
        >
          메모 바로가기
        </List.Item>
        <List.Item
          onClick={() => {
            navigate("/memoEditPage");
          }}
        >
          메모 등록하기
        </List.Item>
      </List>
      <List mode="card" header="일정">
        <List.Item
          onClick={() => {
            navigate("/todoPage");
          }}
        >
          일정 바로가기
        </List.Item>
        <List.Item
          onClick={() => {
            navigate("/todoEditPage");
          }}
        >
          일정 등록하기
        </List.Item>
      </List>
      <List mode="card" header="가계부">
        <List.Item
          onClick={() => {
            navigate("/budgetPage");
          }}
        >
          가계부 바로가기
        </List.Item>
        <List.Item
          onClick={() => {
            navigate("/budgetEditPage", {
              state: {
                type: "income",
              },
            });
          }}
        >
          수입 기록하기
        </List.Item>
        <List.Item
          onClick={() => {
            navigate("/budgetEditPage", {
              state: {
                type: "expense",
              },
            });
          }}
        >
          지출 기록하기
        </List.Item>
        <List.Item
          onClick={() => {
            navigate("/categoryListPage");
          }}
        >
          카테고리 관리하기
        </List.Item>
        <List.Item
          onClick={() => {
            navigate("/budgetChartPage");
          }}
        >
          가계부 통계 보기
        </List.Item>
      </List>
      <List mode="card" header="일기">
        <List.Item
          onClick={() => {
            navigate("/diaryPage");
          }}
        >
          일기 바로가기
        </List.Item>
        <List.Item
          onClick={() => {
            navigate("/diaryEditPage");
          }}
        >
          일기 등록하기
        </List.Item>
      </List>
      <SettingsPage />
    </Flex>
  );
};
export default MenuPage;
