import { Flex, message } from "antd";
import AppHeader from "../components/AppHeader";
import { diaryQuestions, useDiaryStore } from "../store/diaryStore";
import { useState } from "react";
import Label from "../components/Label";
import sizes from "../sizes";
import { Button, TextArea } from "antd-mobile";
import { colors } from "../colors";
import { DiaryData } from "../types";
import { useLocation, useNavigate } from "react-router-dom";

const DiaryEditPage = () => {
  const { diary, updateDiary, saveDiary } = useDiaryStore();
  const location = useLocation();
  const navigate = useNavigate();
  const selDate = location.state?.selDate;
  const prevDiary = diary.find((d) => d.date === selDate);
  const [updatedDiary, setUpdatedDiary] = useState<DiaryData>(
    prevDiary || {
      date: selDate,
      diaries: diaryQuestions.map((question) => ({
        title: question,
        content: "",
      })),
    }
  );
  const handleSaveClick = async () => {
    console.log(`updated diary : ${JSON.stringify(updatedDiary)}`);
    const isNotAllFilled =
      updatedDiary.diaries.filter((item) => item.content === "").length === 3;
    if (isNotAllFilled) {
      message.error("한 개 이상의 질문에 답변을 입력해주세요.");
      return;
    }
    if (!prevDiary) {
      await saveDiary(updatedDiary);
    } else {
      await updateDiary(updatedDiary);
    }
    message.success("저장되었습니다.");
    navigate(-1);
  };
  return (
    <Flex vertical style={{ height: "100vh" }}>
      <AppHeader title={`다이어리 ${prevDiary ? "수정" : "추가"}`} />
      <Flex
        vertical
        style={{ flex: 1, overflowY: "auto", padding: "20px" }}
        gap={15}
      >
        <Flex vertical gap={5}>
          {updatedDiary.diaries.map((d, index) => {
            return (
              <>
                <Label
                  name={d.title}
                  style={{
                    fontSize: sizes.font.medium,
                    fontWeight: "bold",
                  }}
                />
                <Flex>
                  <TextArea
                    value={d.content}
                    autoSize={{ minRows: 2, maxRows: 5 }}
                    style={{
                      backgroundColor: colors.lightGray,
                      padding: 10,
                      borderRadius: 10,
                    }}
                    onChange={(value) => {
                      const updatedDiaries = updatedDiary.diaries.map(
                        (diary, i) => {
                          if (i === index) {
                            return { ...diary, content: value };
                          }
                          return diary;
                        }
                      );
                      const updatedDiaryData = {
                        ...updatedDiary,
                        diaries: updatedDiaries,
                      };
                      setUpdatedDiary(updatedDiaryData);
                    }}
                    placeholder="답변을 입력해주세요."
                  />
                </Flex>
              </>
            );
          })}
        </Flex>
        <Flex>
          <Button
            onClick={handleSaveClick}
            color="primary"
            style={{ width: "100%", height: "50px" }}
          >
            저장
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default DiaryEditPage;
