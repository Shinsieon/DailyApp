import { Button, DatePicker, DatePickerRef, Form, Input } from "antd-mobile";
import dayjs from "dayjs";
import { RefObject } from "react";
import { useTodoStore } from "../store/todoStore";
import { message } from "antd";
import { PopupProps } from "../types";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";

interface NewTodoProps extends PopupProps {
  title?: string;
  date?: string;
}

const NewTodo = (props: NewTodoProps) => {
  const defaultDate = props.date || dayjs().format("YYYYMMDD");
  const isDarkMode = useThemeStore((state) => state.theme.isDarkMode);

  const saveTodo = useTodoStore((state) => state.saveTodo);
  const onFinish = async (values: any) => {
    try {
      await saveTodo({
        title: values.todo,
        date: values.date ? dayjs(values.date).format("YYYYMMDD") : defaultDate,
        completed: false,
      });
    } catch (e) {
      console.log(e);
      message.error("데이터를 추가하는데 실패했습니다.");
      return;
    }
    message.success(`할 일이 추가되었습니다.`);
    if (props.onOk) props.onOk();
  };
  return (
    <Form
      layout="horizontal"
      footer={
        <Button block type="submit" color="primary" size="large">
          확인
        </Button>
      }
      style={{
        backgroundColor: isDarkMode ? colors.darkBlack : colors.lightWhite,
        color: isDarkMode ? colors.lightWhite : colors.darkBlack,
      }}
      onFinish={onFinish}
    >
      <Form.Header>{props.title}</Form.Header>
      <Form.Item
        name="todo"
        label="할 일"
        rules={[{ required: true, message: "할 일을 입력해주세요." }]}
        style={{
          backgroundColor: isDarkMode ? colors.darkBlack : colors.lightWhite,
          color: isDarkMode ? colors.lightWhite : colors.darkBlack,
        }}
      >
        <Input
          placeholder="할 일 입력"
          style={{
            color: isDarkMode ? colors.lightWhite : colors.darkBlack,
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
        style={{
          backgroundColor: isDarkMode ? colors.darkBlack : colors.lightWhite,
          color: isDarkMode ? colors.lightWhite : colors.darkBlack,
        }}
      >
        <DatePicker confirmText="확인" cancelText="취소">
          {(value) => {
            return value
              ? dayjs(value).format("YYYY/MM/DD")
              : dayjs(defaultDate, "YYYYMMDD").format("YYYY/MM/DD");
          }}
        </DatePicker>
      </Form.Item>
    </Form>
  );
};

export default NewTodo;
