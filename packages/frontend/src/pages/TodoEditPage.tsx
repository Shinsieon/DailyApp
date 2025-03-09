import { useLocation, useNavigate } from "react-router-dom";
import { useTodoStore } from "../store/todoStore";
import { RefObject, useEffect, useState } from "react";
import { Flex, message } from "antd";
import AppHeader from "../components/AppHeader";
import {
  DatePicker,
  DatePickerRef,
  Form,
  Input,
  Modal,
  Picker,
  Selector,
} from "antd-mobile";
import { TodoData } from "../types";
import dayjs from "dayjs";
import BottomFixedButton from "../components/BottomFixedButton";
import useGranted from "../hooks/useGranted";
import { api } from "../api";
import { useUserStore } from "../store/userStore";

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
      label: "30",
      value: "30",
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
  const isGranted = useGranted();

  const defaultTodo: TodoData = {
    title: "",
    date: selDate
      ? dayjs(selDate).format("YYYYMMDD")
      : dayjs().format("YYYYMMDD"),
    time: "00:00",
    notification: "",
    completed: false,
  };
  const [todoForm, setTodoForm] = useState<TodoData>(prevTodo || defaultTodo);

  const [form] = Form.useForm();
  const onfinish = async () => {
    console.log(`todoForm : ${JSON.stringify(todoForm)}`);
    try {
      if (prevTodo) {
        console.log(`updating todo : ${JSON.stringify(todoForm)}`);
        await updateTodo(todoForm.id!, todoForm);
      } else {
        console.log(`saving todo : ${JSON.stringify(todoForm)}`);
        await saveTodo(todoForm);
      }
      if (todoForm.notification && user) {
        await api.createTodo(user?.id, todoForm); //서버 : 기존 있던 투두도 업데이트 됩니다.
      }
    } catch (e) {
      message.error("데이터를 저장하는데 실패했습니다.");
      return;
    }
    message.success(`할 일이 저장되었습니다.`);
    navigate(-1);
  };
  return (
    <Flex vertical style={{ height: "100vh" }}>
      <AppHeader title={`할 일 ${prevTodo ? "수정" : "추가"}`} />
      <Flex vertical style={{ flex: 1, overflowY: "auto" }}>
        <Form
          form={form}
          footer={
            <Flex>
              <BottomFixedButton
                type="double"
                onConfirm={onfinish}
                onCancel={() => {
                  if (prevTodo) {
                    Modal.confirm({
                      content: "할 일을 삭제하시겠습니까?",
                      confirmText: "삭제",
                      cancelText: "취소",
                      onConfirm: async () => {
                        deleteTodo(prevTodo.id!);
                        message.success(`할 일이 삭제되었습니다.`);
                        navigate(-1);
                      },
                    });
                  } else {
                    navigate(-1);
                  }
                }}
                confirmName={prevTodo ? "수정" : "저장"}
                cancelName={prevTodo ? "삭제" : "취소"}
              />
            </Flex>
          }
          style={{ height: "300px" }}
          onFinish={onfinish}
        >
          <Form.Item
            name="title"
            label="할 일"
            rules={[{ required: true, message: "할 일을 입력해주세요." }]}
            initialValue={todoForm?.title}

            //--prefix-width
          >
            <Input
              placeholder="할 일을 입력해주세요."
              onChange={(value) => {
                setTodoForm({ ...todoForm, title: value });
              }}
            />
          </Form.Item>
          <Form.Item
            onClick={(_, datePickerRef: RefObject<DatePickerRef>) => {
              datePickerRef.current?.open(); // ⬅️
            }}
            name="date"
            label="날짜"
            trigger="onConfirm"
          >
            <DatePicker
              confirmText="확인"
              cancelText="취소"
              onConfirm={(value) => {
                console.log(`setting new date`);
                setTodoForm({
                  ...todoForm,
                  date: dayjs(value).format("YYYYMMDD"),
                });
              }}
            >
              {() => dayjs(todoForm.date).format("YYYY-MM-DD")}
            </DatePicker>
          </Form.Item>
          <Form.Item
            name="time"
            label="시간"
            onClick={(_, ref) => ref.current.open()}
          >
            <Picker
              style={{
                "--title-font-size": "13px",
                "--header-button-font-size": "13px",
                "--item-font-size": "13px",
                "--item-height": "30px",
              }}
              columns={timeColumns}
              confirmText="확인"
              cancelText="취소"
              onConfirm={(value) => {
                console.log(`setting new time : ${value.join(":")}`);
                setTodoForm({
                  ...todoForm,
                  time: value.join(":"),
                });
              }}
            >
              {() => todoForm.time || "00:00"}
            </Picker>
          </Form.Item>
          <Form.Item
            name="notificationAccepted"
            label="알림 허용"
            initialValue={todoForm.notification ? "1" : "0"}
          >
            <Selector
              options={[
                { label: "알림 거부", value: "0" },
                { label: "알림 허용", value: "1" },
              ]}
              value={[todoForm.notification ? "1" : "0"]}
              onChange={(arr) => {
                console.log(`notificationAccepted : ${arr[0]}`);
                if (arr[0] === "1") {
                  if (!isGranted.isUser) {
                    message.error("로그인 후 사용해주세요.");
                    arr[0] = "0";
                    return;
                  }
                  if (
                    !isGranted.isNativeGranted ||
                    !isGranted.isServerGranted
                  ) {
                    message.error("설정 > 알림 권한을 허용해주세요.");
                    arr[0] = "0";
                    return;
                  }
                }
                setTodoForm({
                  ...todoForm,
                  notification: arr[0] === "1" ? "00:00" : "",
                });
              }}
            />
          </Form.Item>

          <Form.Item
            name="notification"
            label="알림"
            onClick={(_, ref) => {
              ref.current.open();
            }}
            disabled={!todoForm.notification}
          >
            <Picker
              style={{
                "--title-font-size": "13px",
                "--header-button-font-size": "13px",
                "--item-font-size": "13px",
                "--item-height": "30px",
              }}
              columns={timeColumns}
              confirmText="확인"
              cancelText="취소"
              onConfirm={(value) => {
                if (
                  todoForm.time!.replace(":", "") <
                  value.join(":").replace(":", "")
                ) {
                  message.error(
                    "알림 시간은 설정한 시간 이전으로 설정해주세요."
                  );
                  setTodoForm({
                    ...todoForm,
                    notification: "00:00",
                  });
                  return;
                }
                setTodoForm({
                  ...todoForm,
                  notification: value.join(":"),
                });
              }}
            >
              {() => todoForm.notification || "00:00"}
            </Picker>
          </Form.Item>
        </Form>
      </Flex>
    </Flex>
  );
};

export default TodoEditPage;
