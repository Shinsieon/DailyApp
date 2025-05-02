import { useLocation, useNavigate } from "react-router-dom";
import { useTodoStore } from "../store/todoStore";
import { useRef, useState } from "react";
import { Flex, message } from "antd";
import AppHeader from "../components/AppHeader";
import {
  DatePicker,
  DatePickerRef,
  Input,
  Modal,
  Picker,
  Segmented,
} from "antd-mobile";
import { TodoData } from "../types";
import dayjs from "dayjs";
import BottomFixedButton from "../components/BottomFixedButton";
import useGranted from "../hooks/useGranted";
import { api } from "../api";
import { useUserStore } from "../store/userStore";
import Label from "../components/Label";
import sizes from "../sizes";
import { colors } from "../colors";

const timeColumns = [
  [
    {
      label: "00",
      value: "00",
    },
    {
      label: "01",
      value: "01",
    },
    {
      label: "02",
      value: "02",
    },
    {
      label: "03",
      value: "03",
    },
    {
      label: "04",
      value: "04",
    },
    {
      label: "05",
      value: "05",
    },
    {
      label: "06",
      value: "06",
    },
    {
      label: "07",
      value: "07",
    },
    {
      label: "08",
      value: "08",
    },
    {
      label: "09",
      value: "09",
    },
    {
      label: "10",
      value: "10",
    },
    {
      label: "11",
      value: "11",
    },
    {
      label: "12",
      value: "12",
    },
    {
      label: "13",
      value: "13",
    },
    {
      label: "14",
      value: "14",
    },
    {
      label: "15",
      value: "15",
    },
    {
      label: "16",
      value: "16",
    },
    {
      label: "17",
      value: "17",
    },
    {
      label: "18",
      value: "18",
    },
    {
      label: "19",
      value: "19",
    },
    {
      label: "20",
      value: "20",
    },
    {
      label: "21",
      value: "21",
    },
    {
      label: "22",
      value: "22",
    },
    {
      label: "23",
      value: "23",
    },
  ],
  [
    {
      label: "00",
      value: "00",
    },
    {
      label: "10",
      value: "10",
    },
    {
      label: "20",
      value: "20",
    },
    {
      label: "30",
      value: "30",
    },
    {
      label: "40",
      value: "40",
    },
    {
      label: "50",
      value: "50",
    },
  ],
];

const TodoEditPage = () => {
  const location = useLocation();
  const todoId = location.state?.todoId;
  const selDate = location.state?.date;
  const navigate = useNavigate();
  const { saveTodo, updateTodo, deleteTodo, todos } = useTodoStore();
  const prevTodo = todos.find((todo) => todo.id === todoId);
  const user = useUserStore((state) => state.user);
  const datePickerRef = useRef<DatePickerRef>(null);
  const endDatePickerRef = useRef<DatePickerRef>(null);
  const timePickerRef = useRef<Picker>(null);
  const isGranted = useGranted();
  const commonFieldStyle = {
    backgroundColor: colors.lightGray,
    padding: 10,
    borderRadius: 10,
  };
  const defaultTodo: TodoData = {
    title: "",
    date: selDate
      ? dayjs(selDate).format("YYYYMMDD")
      : dayjs().format("YYYYMMDD"),
    endDate: selDate
      ? dayjs(selDate).format("YYYYMMDD")
      : dayjs().format("YYYYMMDD"),
    time: "00:00",
    notification: "",
    completed: false,
  };
  const [todoForm, setTodoForm] = useState<TodoData>(prevTodo || defaultTodo);

  const onfinish = async () => {
    if (!todoForm.title) {
      message.error("일정을 입력해주세요.");
      return;
    }
    if (todoForm.date > todoForm.endDate!) {
      message.error("끝나는 날짜는 시작 날짜보다 이후여야 합니다.");
      return;
    }
    try {
      if (prevTodo) {
        await updateTodo(todoForm.id!, todoForm);
      } else {
        await saveTodo(todoForm);
      }
      if (todoForm.notification && user) {
        await api.createTodo(user?.id, todoForm); //서버 : 기존 있던 투두도 업데이트 됩니다.
      }
    } catch (e) {
      message.error("데이터를 저장하는데 실패했습니다.");
      return;
    }
    message.success(`일정이 저장되었습니다.`);
    navigate(-1);
  };
  return (
    <Flex vertical style={{ height: "100vh" }}>
      <AppHeader title={`일정 ${prevTodo ? "수정" : "추가"}`} />
      <Flex
        vertical
        style={{ flex: 1, overflowY: "auto", padding: "20px" }}
        gap={15}
      >
        <Flex vertical gap={5}>
          <Label
            name="일정"
            style={{
              fontSize: sizes.font.medium,
              fontWeight: "bold",
            }}
          />
          <Flex>
            <Input
              value={todoForm?.title}
              style={commonFieldStyle}
              onChange={(e) => {
                setTodoForm({ ...todoForm, title: e });
              }}
              placeholder="제목을 입력해주세요."
            />
          </Flex>
        </Flex>
        <Flex vertical gap={5}>
          <Label
            name="날짜"
            style={{
              fontSize: sizes.font.medium,
              fontWeight: "bold",
            }}
          />
          <Flex>
            <Input
              style={commonFieldStyle}
              value={dayjs(todoForm.date).format("YYYY-MM-DD")}
              onClick={() => {
                datePickerRef.current?.open(); // ⬅️
              }}
            />
          </Flex>

          <DatePicker
            confirmText="확인"
            cancelText="취소"
            ref={datePickerRef}
            onConfirm={(value) => {
              setTodoForm({
                ...todoForm,
                date: dayjs(value).format("YYYYMMDD"),
                endDate: dayjs(value).format("YYYYMMDD"),
              });
            }}
          />
        </Flex>
        <Flex vertical gap={5}>
          <Label
            name="끝나는 날짜"
            style={{
              fontSize: sizes.font.medium,
              fontWeight: "bold",
            }}
          />
          <Flex>
            <Input
              style={commonFieldStyle}
              value={
                todoForm.endDate
                  ? dayjs(todoForm.endDate).format("YYYY-MM-DD")
                  : dayjs(todoForm.date).format("YYYY-MM-DD")
              }
              onClick={() => {
                endDatePickerRef.current?.open(); // ⬅️
              }}
            />
          </Flex>

          <DatePicker
            confirmText="확인"
            cancelText="취소"
            ref={endDatePickerRef}
            onConfirm={(value) => {
              setTodoForm({
                ...todoForm,
                endDate: dayjs(value).format("YYYYMMDD"),
              });
            }}
          />
        </Flex>
        <Flex vertical gap={5}>
          <Label
            name="시간"
            style={{
              fontSize: sizes.font.medium,
              fontWeight: "bold",
            }}
          />
          <Flex>
            <Input
              style={commonFieldStyle}
              value={todoForm.time}
              onClick={() => {
                timePickerRef.current?.open(); // ⬅️
              }}
            />
          </Flex>

          <Picker
            style={{
              "--title-font-size": "13px",
              "--header-button-font-size": "13px",
              "--item-font-size": "13px",
              "--item-height": "30px",
            }}
            ref={timePickerRef}
            columns={timeColumns}
            confirmText="확인"
            cancelText="취소"
            onConfirm={(value) => {
              setTodoForm({
                ...todoForm,
                time: value.join(":"),
              });
            }}
          ></Picker>
        </Flex>
        <Flex vertical gap={5}>
          <Label
            name="알림"
            style={{
              fontSize: sizes.font.medium,
              fontWeight: "bold",
            }}
          />
          <Flex>
            <Segmented
              options={["알림 없음", "알림 설정"]}
              value={todoForm.notification ? "알림 설정" : "알림 없음"}
              onChange={(e) => {
                if (e === "알림 없음") {
                  setTodoForm({ ...todoForm, notification: "" });
                } else {
                  if (!isGranted.isUser) {
                    message.error("로그인 후 사용해주세요.");
                    return;
                  }
                  if (
                    !isGranted.isNativeGranted ||
                    !isGranted.isServerGranted
                  ) {
                    message.error("설정 > 알림 권한을 허용해주세요.");
                    return;
                  }
                  setTodoForm({ ...todoForm, notification: "00:00" });
                }
              }}
            />
          </Flex>
        </Flex>
      </Flex>
      <BottomFixedButton
        type="double"
        confirmName={prevTodo ? "수정" : "저장"}
        onConfirm={onfinish}
        onCancel={() => {
          if (prevTodo) {
            Modal.confirm({
              content: "일정을 삭제하시겠습니까?",
              confirmText: "삭제",
              cancelText: "취소",
              onConfirm: async () => {
                deleteTodo(prevTodo.id!);
                message.success(`일정이 삭제되었습니다.`);
                navigate(-1);
              },
            });
          } else {
            navigate(-1);
          }
        }}
        cancelName={prevTodo ? "삭제" : "취소"}
      />
    </Flex>
  );
};

export default TodoEditPage;
