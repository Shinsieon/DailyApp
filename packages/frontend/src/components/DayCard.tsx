import { Flex } from "antd";
import Title from "./Title";
import Label from "./Label";
import Profile from "./Profile";
import dayjs from "dayjs";

const dayMap = {
  Monday: "월요일",
  Tuesday: "화요일",
  Wednesday: "수요일",
  Thursday: "목요일",
  Friday: "금요일",
  Saturday: "토요일",
  Sunday: "일요일",
};
const DayCard = () => {
  const today = dayjs().format("YYYY년 MM월 DD일");
  const dayName = dayjs().format("dddd") as keyof typeof dayMap;
  return (
    <Flex justify="space-between">
      <Flex vertical>
        <Title name={dayMap[dayName]} level={2} style={{ margin: "3px 0px" }} />
        <Label name={today} style={{ fontSize: 16 }} />
      </Flex>
      <Profile />
    </Flex>
  );
};

export default DayCard;
