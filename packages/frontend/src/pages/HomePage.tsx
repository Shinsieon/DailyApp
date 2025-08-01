import { NoticeBar, Space } from "antd-mobile";
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
import DiaryCard from "../components/DiaryCard";
import { colors } from "../colors";

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
        setPatchNotes(response[0]);
        // const prevPatchNotes = localStorage.getItem("patchNote");
        // if (!prevPatchNotes) {
        //   setPatchNotes(response[0]);
        //   return;
        // }
        // const jsonPrevPatchNotes = JSON.parse(prevPatchNotes);
        // if (jsonPrevPatchNotes.version !== response[0].version) {
        //   const [major, minor, patch] = response[0].version.split(".");
        //   const [prevMajor, prevMinor, prevPatch] =
        //     jsonPrevPatchNotes.version.split(".");
        //   if (major > prevMajor || minor > prevMinor) {
        //     if (
        //       confirm("새로운 기능이 추가되었습니다. 앱 업데이트를 받아주세요.")
        //     ) {
        //       setPatchNotes(response[0]);
        //       localStorage.setItem("patchNote", JSON.stringify(response[0]));
        //       const appId = "6740744415";
        //       const APP_STORE_URL = `itms-apps://apps.apple.com/app/id${appId}`; // 실제 앱 ID로 변경

        //       window.location.href = APP_STORE_URL;
        //     }
        //   } else {
        //     setPatchNotes(response[0]);
        //     localStorage.setItem("patchNote", JSON.stringify(response[0]));
        //   }

        //   return;
        // }
      } catch (error) {
        showError(error);
      }
    };
    fetchPatchNotes();
  }, []);

  return (
    <Flex
      vertical
      gap={10}
      style={{
        overflowY: "auto",
        width: "100%",
      }}
    >
      {patchNotes && (
        <NoticeBar
          color="info"
          bordered={false}
          className="blinking-text"
          content={"새로운 소식이 추가되었어요!"}
          onClick={() => {
            navigate("/patchNotePage");
            localStorage.setItem("patchNote", JSON.stringify(patchNotes));
          }}
        />
      )}
      <Flex style={{ padding: 20 }} vertical>
        <DayCard />
      </Flex>
      <Flex
        vertical
        gap={10}
        style={{
          backgroundColor: colors.lighterGray,
          padding: "10px 20px",
        }}
      >
        <WeatherCard />
        <Flex gap={10}>
          <Flex style={{ flex: 1 }}>
            <MemoCard />
          </Flex>
          <Flex style={{ flex: 1 }}>
            <TodoCard />
          </Flex>
        </Flex>
        <Flex>
          <DiaryCard />
        </Flex>
        <Flex>
          <BudgetCard />
        </Flex>
        <HelpCard />
      </Flex>
    </Flex>
  );
};

export default HomePage;
