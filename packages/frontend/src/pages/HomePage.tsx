import { NoticeBar } from "antd-mobile";
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
  }, []);
  return (
    <Flex
      vertical
      style={{
        height: "100%",
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
  );
};

export default HomePage;
