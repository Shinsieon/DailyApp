import { Empty, Flex } from "antd";
import Label from "./Label";
import { generateLightColor } from "../utils";
import { TodoData } from "../types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Space } from "antd-mobile";

const timeArray: string[] = [];
const rowHeight = 40;
for (let i = 0; i < 24; i++) {
  //format 00:00
  timeArray.push(`${i < 10 ? `0${i}` : i}:00`);
}

interface TimeTableProps {
  todos: TodoData[];
}
const TimeTable = (props: TimeTableProps) => {
  const [timeMap, setTimeMap] = useState<{ [key: string]: TodoData[] }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const timeMap: { [key: string]: TodoData[] } = {};
    for (let i = 0; i < timeArray.length; i++) {
      timeMap[timeArray[i]] = [];
    }
    for (let i = 0; i < props.todos.length; i++) {
      const todo = props.todos[i];
      if (todo.time) {
        const hour = todo.time.substring(0, 2) + ":00";
        if (!timeMap[hour]) {
          timeMap[hour] = [todo];
        } else timeMap[hour].push(todo);
      } else {
        timeMap["00:00"].push(todo);
      }
    }
    setTimeMap(timeMap);
  }, [props.todos]);
  if (props.todos.length === 0) {
    return <Empty />;
  }
  return (
    <Flex
      style={{
        width: "100%",
        padding: "20px 0px",
      }}
      justify="center"
      gap={20}
    >
      <Flex vertical gap={20}>
        {timeArray.map((time) => {
          return (
            <Flex style={{ height: rowHeight }}>
              <Label name={time} style={{}} placeholder />
            </Flex>
          );
        })}
      </Flex>
      <Flex vertical style={{ flex: 1 }} gap={20}>
        {Object.keys(timeMap).map((time) => {
          return (
            <Flex
              style={{
                height: rowHeight,
                minHeight: rowHeight,
              }}
              justify="space-between"
              gap={10}
            >
              {timeMap[time].length > 0 ? (
                timeMap[time].map((todo) => {
                  return (
                    <Flex
                      style={{
                        backgroundColor: generateLightColor(),
                        padding: 5,
                        borderRadius: 5,
                        minHeight: rowHeight,
                        height: rowHeight,
                        flex: 1,
                      }}
                      onClick={() => {
                        navigate(`/todoEditPage`, {
                          state: { todoId: todo.id },
                        });
                      }}
                    >
                      <Label name={todo.title} />
                    </Flex>
                  );
                })
              ) : (
                <Space
                  style={{ minHeight: rowHeight, height: rowHeight }}
                ></Space>
              )}
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default TimeTable;
