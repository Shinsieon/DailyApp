import { useNavigate } from "react-router-dom";
import { useDiaryStore } from "../store/diaryStore";
import dayjs from "dayjs";
import CustomCard from "./CustomCard";
import { Empty, Flex } from "antd";
import CardItem from "./CardItem";

const DiaryCard = () => {
  const navigate = useNavigate();
  const diary = useDiaryStore((state) => state.diary);
  const todayDiary = diary.find((d) => d.date === dayjs().format("YYYYMMDD"));
  return (
    <CustomCard
      title="일기"
      onAddClick={() => {
        navigate("diaryEditPage", {
          state: { selDate: dayjs().format("YYYYMMDD") },
        });
      }}
      onClick={() => {
        navigate("diaryPage");
      }}
      children={
        <>
          {todayDiary ? (
            <Flex vertical gap={5}>
              {todayDiary.diaries.map((diary, index) => (
                <CardItem
                  title={diary.title}
                  key={index}
                  description={diary.content}
                  backgroundColor={"#F0F0F0"}
                  onClick={(e) => {
                    e.stopPropagation();
                    //navigate("diaryEditPage", {
                  }}
                />
              ))}
            </Flex>
          ) : (
            <Empty />
          )}
        </>
      }
    />
  );
};

export default DiaryCard;
