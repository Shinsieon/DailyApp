import { Divider, NoticeBar, Space } from "antd-mobile";
import BudgetCard from "../components/BudgetCard";
import TodoCard from "../components/TodoCard";
import MemoCard from "../components/MemoCard";
import { useEffect, useState } from "react";
import { PatchNote } from "../types";
import { api, showError } from "../api";
import { useNavigate } from "react-router-dom";
import { Flex } from "antd";
import WeatherCard from "../components/WeatherCard";
import DayCard from "../components/DayCard";
import HelpCard from "../components/SurveyCard";

const HomePage = () => {
  const [patchNotes, setPatchNotes] = useState<PatchNote | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatchNotes = async () => {
      console.log("fetchPatchNotes");
      try {
        const response = await api.getPatchNotes();
        if (!response || response.length === 0) {
          return;
        }
        const prevPatchNotes = localStorage.getItem("patchNote");
        console.log(`prevPatchNotes: ${prevPatchNotes}`);
        if (!prevPatchNotes) {
          setPatchNotes(response[0]);
          return;
        }
        const jsonPrevPatchNotes = JSON.parse(prevPatchNotes);
        console.log(`jsonPrevPatchNotes: ${jsonPrevPatchNotes.version}`);
        console.log(`response[0].version: ${response[0].version}`);
        if (jsonPrevPatchNotes.version !== response[0].version) {
          const [major, minor, patch] = response[0].version.split(".");
          const [prevMajor, prevMinor, prevPatch] =
            jsonPrevPatchNotes.version.split(".");
          if (major > prevMajor || minor > prevMinor) {
            if (
              confirm("새로운 기능이 추가되었습니다. 앱 업데이트를 받아주세요.")
            ) {
              setPatchNotes(response[0]);
              localStorage.setItem("patchNote", JSON.stringify(response[0]));
              const appId = "6740744415";
              const APP_STORE_URL = `itms-apps://apps.apple.com/app/id${appId}`; // 실제 앱 ID로 변경

              window.location.href = APP_STORE_URL;
            }
          } else {
            setPatchNotes(response[0]);
            localStorage.setItem("patchNote", JSON.stringify(response[0]));
          }

          return;
        }
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
      <DayCard />
      <WeatherCard />
      <MemoCard />
      <TodoCard />
      <BudgetCard />
      <Divider />
      <HelpCard />
      <Space style={{ height: "100px" }} />
    </Flex>
  );
};

export default HomePage;
