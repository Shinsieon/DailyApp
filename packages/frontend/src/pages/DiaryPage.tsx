import { Flex } from "antd";
import AppHeader from "../components/AppHeader";
import Label from "../components/Label";
import CustomCalendar from "../components/CustomCalendar";
import { useEffect, useState } from "react";
import dayjs, { ManipulateType } from "dayjs";
import sizes from "../sizes";
import { Collapse, FloatingBubble, TextArea } from "antd-mobile";
import { diaryQuestions, useDiaryStore } from "../store/diaryStore";
import { DiaryData } from "../types";
import { useNavigate } from "react-router-dom";
import { EditFill } from "antd-mobile-icons";

const DiaryPage = () => {
  const [selDate, setSelDate] = useState<string>(dayjs().format("YYYYMMDD"));
  const { diary } = useDiaryStore();
  const [prevDiary, setPrevDiary] = useState<DiaryData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const found = diary.find((d) => d.date === selDate);
    if (found) {
      setPrevDiary(found);
    } else {
      setPrevDiary({
        date: selDate,
        diaries: diaryQuestions.map((question) => ({
          title: question,
          content: "",
        })),
      });
    }
  }, [selDate]);

  return (
    <Flex vertical style={{ height: "100vh" }}>
      {/* 100vh 지우지말것 */}
      <AppHeader title="다이어리 정리" />
      <Flex vertical style={{ flex: 1, overflowY: "auto" }}>
        <CustomCalendar
          allowedManipulateTypes={["day"]}
          selDate={selDate}
          onClick={(date) => {
            console.log("seldate changed!");
            setSelDate(date);
          }}
          checkDates={diary.map((d) => d.date)}
        />
        <Label
          name={dayjs(selDate).format("YYYY년 MM월 DD일")}
          style={{ padding: "0px 20px", fontSize: sizes.font.large }}
          placeholder
        />
        <Flex vertical>
          <Collapse defaultActiveKey={["0", "1", "2"]}>
            {diaryQuestions.map((question, index) => {
              return (
                <Collapse.Panel
                  title={prevDiary ? prevDiary?.diaries[index].title : question}
                  key={index.toString()}
                >
                  <Flex>
                    <TextArea
                      disabled
                      value={prevDiary?.diaries[index].content}
                    />
                  </Flex>
                </Collapse.Panel>
              );
            })}
          </Collapse>
        </Flex>
      </Flex>
      <FloatingBubble
        style={{
          "--initial-position-bottom": "24px",
          "--initial-position-right": "24px",
          "--edge-distance": "24px",
        }}
        onClick={() => navigate("/diaryEditPage", { state: { selDate } })}
      >
        <EditFill fontSize={32} />
      </FloatingBubble>
    </Flex>
  );
};

export default DiaryPage;
