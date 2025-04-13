import { Flex } from "antd";
import dayjs, { ManipulateType } from "dayjs";
import Label from "./Label";
import { colors } from "../colors";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Segmented } from "antd-mobile";
import { CalendarOutline } from "antd-mobile-icons";
import { AllowedManipulateType } from "../types";
interface CustomCalendarProps {
  selDate: string;
  onClick: (date: string) => void;
  allowedManipulateTypes?: AllowedManipulateType[];
  onTypeChange?: (type: ManipulateType) => void;
  checkDates?: string[];
}
type DayType = {
  [key in AllowedManipulateType]: string[];
};

const dayArr = ["일", "월", "화", "수", "목", "금", "토"];
const firstDay = dayjs().startOf("year");
const today = dayjs().format("YYYYMMDD");
const days: DayType = {
  day: Array.from({ length: 365 }, (_, i) =>
    firstDay.add(i, "day").format("YYYYMMDD")
  ),

  month: Array.from({ length: 12 }, (_, i) =>
    firstDay.add(i, "month").format("YYYYMMDD")
  ),
};
const CustomCalendar = (props: CustomCalendarProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  // ⭐ checkDates를 상태로 유지하여 selDate 변경 시에도 초기화되지 않도록 함
  // ✅ days 배열을 useMemo로 캐싱 (불필요한 상태 제거)
  const [dayType, setDayType] = useState<AllowedManipulateType>("day");
  const [selDate, setSelDate] = useState<string>(props.selDate || today);
  // ✅ `checkedDates`는 props에서 직접 가져오고, dayType에 따라 가공
  const checkedDates = useMemo(() => {
    return dayType === "day"
      ? props.checkDates || []
      : dayType === "month"
        ? props.checkDates?.map((item) => item.substring(0, 6)) || []
        : props.checkDates?.map((item) => item.substring(0, 4)) || [];
  }, [dayType, props.checkDates]);
  let segmentedOptions = [
    {
      label: "일",
      value: "day",
    },

    {
      label: "월",
      value: "month",
    },
    {
      label: "연",
      value: "year",
    },
  ];
  if (props.allowedManipulateTypes) {
    segmentedOptions = segmentedOptions.filter((option) =>
      props.allowedManipulateTypes?.includes(
        option.value as AllowedManipulateType
      )
    );
  } else {
    //default
    segmentedOptions = segmentedOptions.filter((option) =>
      ["day", "month"].includes(option.value as AllowedManipulateType)
    );
  }

  useEffect(() => {
    props.onTypeChange?.(dayType);

    if (dayType === "day") {
      handleClick(dayjs().format("YYYYMMDD"));
    } else if (dayType === "month") {
      const firstOfMonth = dayjs(selDate).startOf("month").format("YYYYMMDD");
      handleClick(firstOfMonth);
    } else if (dayType === "year") {
      const firstOfYear = dayjs(selDate).startOf("year").format("YYYYMMDD");
      handleClick(firstOfYear);
    }
  }, [dayType]);
  // ✅ 날짜 클릭 핸들러 (useCallback으로 최적화)
  const handleClick = (day: string) => {
    setSelDate(day);
    props.onClick(day);
    if (scrollRef.current) {
      handleBackToDay(day);
    }
  };
  // ✅ 스크롤을 오늘 날짜로 이동
  const handleBackToDay = useCallback(
    (day: string) => {
      if (scrollRef.current) {
        const todayIndex = days[dayType].indexOf(day);
        if (todayIndex !== -1) {
          const itemWidth = 60;
          scrollRef.current.scrollTo({
            left:
              todayIndex * itemWidth -
              scrollRef.current.clientWidth / 2 +
              itemWidth / 2,
            behavior: "smooth",
          });
        }
      }
    },
    [dayType]
  );

  return (
    <Flex vertical style={{ padding: "20px" }}>
      <Flex justify="center">
        <Segmented
          options={segmentedOptions}
          block
          value={dayType}
          onChange={(value) => setDayType(value as AllowedManipulateType)}
          style={{ flex: 1 }}
        />
        <Button
          onClick={() => {
            if (dayType === "day") {
              handleClick(dayjs().format("YYYYMMDD"));
            } else if (dayType === "month") {
              handleClick(dayjs().startOf("month").format("YYYYMMDD"));
            } else if (dayType === "year") {
              handleClick(dayjs().startOf("year").format("YYYYMMDD"));
            }
          }}
          style={{ marginLeft: 10 }}
          color="primary"
        >
          <CalendarOutline />
          오늘
        </Button>
      </Flex>

      <Flex
        ref={scrollRef}
        gap={10}
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          padding: "10px 0",
          scrollBehavior: "smooth",
        }}
      >
        {days[dayType].map((day) => {
          const indexOfDay = dayjs(day).day();

          const isSunday = indexOfDay === 0;
          const isSaturday = indexOfDay === 6;
          const isHoliday = isSunday || isSaturday;

          const date = day.substring(6);
          const month = day.substring(4, 6);
          const isCheckedDate = (
            dayType === "day"
              ? checkedDates
              : checkedDates.map((item) => item.substring(0, 6))
          ).includes(dayType === "day" ? day : day.substring(0, 6));
          return (
            <Flex
              key={day}
              vertical
              justify="center"
              align="center"
              style={{
                borderRadius: 10,
                padding: "10px",
                backgroundColor:
                  day === selDate
                    ? colors.primary
                    : isCheckedDate
                      ? colors.lightGray
                      : colors.lightWhite,
                minWidth: 30,
                flexShrink: 0,
                transition: "opacity 0.3s ease",
                position: "relative",
              }}
              onClick={() => handleClick(day)}
            >
              <Label
                name={date}
                style={{
                  color:
                    day === selDate
                      ? colors.lightWhite
                      : isHoliday
                        ? colors.tomato
                        : colors.darkBlack,
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              />
              <Label
                name={dayArr[indexOfDay]}
                style={{
                  color:
                    day === selDate
                      ? colors.lightWhite
                      : isHoliday
                        ? colors.tomato
                        : colors.darkBlack,
                }}
              />
              <Label
                name={month.substring(month[0] === "0" ? 1 : 0, 2) + "월"}
                style={{
                  color: colors.darkGray,
                  fontSize: 12,
                  padding: "0px 5px",
                  borderRadius: 5,
                  backgroundColor: colors.lightGray,
                }}
              />
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default CustomCalendar;
