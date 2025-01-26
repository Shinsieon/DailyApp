import {
  Button,
  Cascader,
  DatePicker,
  DatePickerRef,
  Form,
  Input,
} from "antd-mobile";
import dayjs from "dayjs";
import { RefObject, useState } from "react";
import { BudgetData, PopupProps } from "../types";
import { message } from "antd";
import { useBudgetStore } from "../store/budgetStore";
import { CheckListValue } from "antd-mobile/es/components/check-list";
import Label from "../components/Label";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";
import { translateToKorean } from "../utils";

interface NewBudgetProps extends PopupProps {
  type: "income" | "expense";
}
const options = {
  income: [
    { label: "월급", value: "salary" },
    { label: "용돈", value: "allowance" },
    { label: "사업소득", value: "business" },
    { label: "보너스", value: "bonus" },
    { label: "이자수익", value: "interest" },
    { label: "투자수익", value: "investment" },
    { label: "임대수익", value: "rental" },
    { label: "정부지원금", value: "government_support" },
    { label: "프리랜서 수입", value: "freelance" },
    { label: "기타", value: "others" },
  ],
  expense: [
    { label: "식비", value: "food" },
    { label: "교통비", value: "transportation" },
    { label: "문화생활", value: "entertainment" },
    { label: "의료비", value: "medical" },
    { label: "교육비", value: "education" },
    { label: "주거비", value: "housing" },
    { label: "쇼핑", value: "shopping" },
    { label: "공과금", value: "utilities" },
    { label: "여행", value: "travel" },
    { label: "취미활동", value: "hobbies" },
    { label: "보험료", value: "insurance" },
    { label: "기타", value: "others" },
  ],
};

interface NewBudgetProps extends PopupProps {
  type: "income" | "expense";
  date?: string; //20241202
  selBudget: BudgetData | null;
}

interface FormValues {
  amount: string;
  date: string;
}

const NewBudget = (props: NewBudgetProps) => {
  let deafultCategory = options[props.type][0];
  if (props.selBudget) {
    const foundCat = options[props.type].find(
      (item) => item.value === props.selBudget?.category.value
    );
    if (foundCat) deafultCategory = foundCat;
  }
  const [category, setCategory] = useState(deafultCategory);
  const [visible, setVisible] = useState(false);
  const [koreaMoney, setKoreaMoney] = useState(
    props.selBudget ? translateToKorean(props.selBudget.amount) : ""
  );
  const saveBudget = useBudgetStore((state) => state.saveBudget);
  const updateBudget = useBudgetStore((state) => state.updateBudget);
  const defaultDate = props.date || dayjs().format("YYYYMMDD");
  const defaultAmount = props.selBudget
    ? props.selBudget.amount.toString()
    : "";
  const [amount, setAmount] = useState(defaultAmount);
  const isDarkMode = useThemeStore((state) => state.theme.isDarkMode);
  const [other, setOther] = useState(props.selBudget?.other || "");

  const onFinish = async (values: FormValues) => {
    if (parseInt(amount) <= 0 || Number.isNaN(parseInt(amount))) {
      message.error("금액을 확인해주세요.");
      return;
    }
    try {
      const newBudget = {
        date: values.date ? dayjs(values.date).format("YYYYMMDD") : defaultDate,
        category: category,
        amount: parseInt(amount),
        type: props.type,
        other: other,
      };
      if (props.selBudget) {
        await updateBudget({ ...props.selBudget, ...newBudget });
      } else await saveBudget(newBudget);
    } catch (e) {
      message.error("데이터를 추가하는데 실패했습니다.");
      return;
    }
    message.success(
      `${props.type === "income" ? "수입이" : "지출이"} 기록 되었습니다.`
    );
    if (props.onOk) props.onOk();
  };
  return (
    <Form
      layout="horizontal"
      footer={
        <Button block type="submit" color="primary" size="large">
          {props.selBudget ? "수정" : "확인"}
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
        name="amount"
        label="금액"
        style={{
          backgroundColor: isDarkMode ? colors.darkBlack : colors.lightWhite,
          color: isDarkMode ? colors.lightWhite : colors.darkBlack,
        }}
        rules={[{ required: true, message: "금액을 입력해주세요" }]}
        extra={"₩"}
        initialValue={defaultAmount}
      >
        <Input
          placeholder="금액입력"
          inputMode="numeric"
          value={amount}
          onChange={(value) => {
            setAmount(value);
            setKoreaMoney(translateToKorean(parseInt(value)));
          }}
        />
      </Form.Item>
      {koreaMoney && koreaMoney.length > 0 && (
        <Form.Item
          name="translateToKorean"
          style={{
            backgroundColor: isDarkMode ? colors.darkBlack : colors.lightWhite,
            textAlign: "right",
          }}
        >
          <Label name={koreaMoney + "원"} style={{ color: colors.primary }} />
        </Form.Item>
      )}
      <Form.Item
        onClick={(_, datePickerRef: RefObject<DatePickerRef>) => {
          datePickerRef.current?.open(); // ⬅️
        }}
        style={{
          backgroundColor: isDarkMode ? colors.darkBlack : colors.lightWhite,
          color: isDarkMode ? colors.lightWhite : colors.darkBlack,
        }}
        name="date"
        label="날짜"
        trigger="onConfirm"
      >
        <DatePicker confirmText="확인" cancelText="취소">
          {(value) =>
            value
              ? dayjs(value).format("YYYY/MM/DD")
              : dayjs(defaultDate, "YYYYMMDD").format("YYYY/MM/DD")
          }
        </DatePicker>
      </Form.Item>
      <Form.Item
        label="카테고리"
        style={{
          backgroundColor: isDarkMode ? colors.darkBlack : colors.lightWhite,
          color: isDarkMode ? colors.lightWhite : colors.darkBlack,
        }}
        rules={[{ required: true, message: "카테고리를 선택해주세요" }]}
        onClick={() => setVisible(true)}
      >
        <Label name={category.label} />
        <Cascader
          options={options[props.type]}
          visible={visible}
          confirmText="확인"
          cancelText="취소"
          placeholder="카테고리선택"
          onConfirm={(value: CheckListValue[]) => {
            setVisible(false);
            const g = options[props.type].find(
              (item) => item.value === value[0]
            );
            if (g) setCategory(g);
          }}
          onCancel={() => setVisible(false)}
          value={[category.value]}
          defaultValue={[category.value]}
        />
      </Form.Item>
      <Form.Item
        label="기타"
        style={{
          backgroundColor: isDarkMode ? colors.darkBlack : colors.lightWhite,
          color: isDarkMode ? colors.lightWhite : colors.darkBlack,
        }}
        rules={[{ required: false, message: "상세 내역을 남겨주세요" }]}
      >
        <Input
          placeholder="기타 내용"
          value={other}
          onChange={(value) => {
            setOther(value);
          }}
        />
      </Form.Item>
    </Form>
  );
};

export default NewBudget;
