import { useLocation, useNavigate } from "react-router-dom";
import { useTodoStore } from "../store/todoStore";
import { RefObject, useEffect, useState } from "react";
import { Flex, message } from "antd";
import AppHeader from "../components/AppHeader";
import { DatePicker, DatePickerRef, Form, Input, Picker } from "antd-mobile";
import { TodoData } from "../types";
import dayjs from "dayjs";
import BottomFixedButton from "../components/BottomFixedButton";

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
  const navigate = useNavigate();
  const { saveTodo, updateTodo, todos } = useTodoStore();
  const prevTodo = todos.find((todo) => todo.id === todoId);
  const defaultTodo: TodoData = {
    title: "",
    date: dayjs().format("YYYYMMDD"),
    time: "00:00",
    completed: false,
  };
  const [todoForm, setTodoForm] = useState<TodoData>(prevTodo || defaultTodo);
  const [form] = Form.useForm();
  useEffect(() => {}, []);
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
            <BottomFixedButton
              name={prevTodo ? "수정" : "저장"}
              type="submit"
            />
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
        </Form>
      </Flex>
    </Flex>
  );
};

export default TodoEditPage;
