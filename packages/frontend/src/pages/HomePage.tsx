import { Button, Space, NoticeBar } from "antd-mobile";
import BudgetCard from "../components/BudgetCard";
import TodoCard from "../components/TodoCard";
import MemoCard from "../components/MemoCard";
import { useEffect, useState } from "react";
import { PatchNote } from "../types";
import { api, showError } from "../api";
import { useNavigate } from "react-router-dom";
import { Flex } from "antd";
const HomePage = () => {
  const [patchNotes, setPatchNotes] = useState<PatchNote | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const checkAndRequestReview = async () => {
      try {
        // 1. 현재 접속 횟수 가져오기
        const visitCountString = localStorage.getItem("visitCount");
        const visitCount = visitCountString
          ? parseInt(visitCountString, 10)
          : 0;

        // 2. 접속 횟수 증가
        const newVisitCount = visitCount + 1;
        localStorage.setItem("visitCount", newVisitCount.toString());
        console.log(`Current visit count: ${newVisitCount}`);

        // 3. 접속 횟수가 5회 이상인 경우 리뷰 요청
        if (newVisitCount === 5) {
          if (window && window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: "review" })
            );
          }
        }
      } catch (error) {
        console.error("Error handling visit count:", error);
      }
    };
    const fetchPatchNotes = async () => {
      try {
        const response = await api.getPatchNotes();
        if (!response || response.length === 0) {
          return;
        }
        const prevPatchNotes = localStorage.getItem("patchNote");
        if (!prevPatchNotes) {
          setPatchNotes(response[0]);
          return;
        }
        const jsonPrevPatchNotes = JSON.parse(prevPatchNotes);
        if (jsonPrevPatchNotes.version !== response[0].version) {
          setPatchNotes(response[0]);
          return;
        }
        console.log("patchNotes", response);
      } catch (error) {
        showError(error);
      }
    };
    fetchPatchNotes();
    checkAndRequestReview();
  }, []);
  return (
    <>
      <Flex
        vertical
        style={{
          width: "100%",
          gap: "10px",
          overflowY: "auto",
          padding: "30px 20px",
        }}
      >
        {patchNotes && (
          <NoticeBar
            color="info"
            shape="rounded"
            bordered={false}
            className="blinking-text"
            content={"새로운 기능이 추가되었어요!"}
            onClick={() => {
              navigate("/patch-note");
              localStorage.setItem("patchNote", JSON.stringify(patchNotes));
            }}
          />
        )}

        <MemoCard />
        <TodoCard />
        <BudgetCard />
      </Flex>
    </>
  );
};

export default HomePage;
