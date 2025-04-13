import { Flex } from "antd";
import { colors } from "../colors";
import Label from "./Label";
import { useNavigate } from "react-router-dom";
import { useDiaryStore } from "../store/diaryStore";
import { RightOutline } from "antd-mobile-icons";
import { PlusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DiaryData } from "../types";

const DiaryCard = () => {
  const navigate = useNavigate();
  const diary = useDiaryStore((state) => state.diary);
  return (
    <Flex vertical style={{ backgroundColor: colors.lighterGray, padding: 10 }}>
      <Flex justify="space-between" style={{ marginBottom: 10 }}>
        <Label
          name="Diary"
          style={{ fontWeight: "bold", fontSize: 20 }}
          onClick={() => {
            navigate("/diaryPage");
          }}
        />
        <Flex style={{ alignItems: "center" }}>
          <RightOutline
            onClick={() => {
              navigate("diaryPage");
            }}
            style={{
              fontSize: 15,
              padding: 5,
              borderRadius: 10,
              color: colors.lightWhite,
              backgroundColor: colors.darkGray,
            }}
          />
        </Flex>
      </Flex>
      {/* <Flex vertical gap={5}>
        {diary.map(
          (d: DiaryData, index: number) =>
            index < 3 && <DiaryItem key={d.id} {...d} />
        )}
      </Flex> */}
    </Flex>
  );
};

function DiaryItem(diary: DiaryData) {
  const navigate = useNavigate();
  return (
    <Flex
      style={{
        backgroundColor: colors.lightRed,
        padding: 10,
        borderRadius: 10,
      }}
      justify="space-between"
      align="center"
      onClick={() => {
        navigate("/diaryEditPage", { state: { selDate: diary.date } });
      }}
    >
      <Label
        name={diary.date + "일 일기"}
        style={{
          fontWeight: "bold",
          fontSize: 18,
          maxWidth: 150, // 제목이 너무 길어지지 않도록 최대 너비 설정
          overflow: "hidden",
          whiteSpace: "nowrap", // 한 줄로 유지
          textOverflow: "ellipsis", // 길면 "..." 표시
        }}
      />
    </Flex>
  );
}

export default DiaryCard;
