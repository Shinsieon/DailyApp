import {
  Button,
  Cascader,
  DatePicker,
  DatePickerRef,
  Form,
  Input,
} from "antd-mobile";
import dayjs from "dayjs";
import { RefObject, useEffect, useState } from "react";
import { BudgetData, BudgetType, CategoryData, PopupProps } from "../types";
import { message } from "antd";
import { useBudgetStore } from "../store/budgetStore";
import { CheckListValue } from "antd-mobile/es/components/check-list";
import Label from "../components/Label";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";
import { translateToKorean } from "../utils";
import { api } from "../api";

interface NewBudgetProps extends PopupProps {
  type: BudgetType;
}

interface NewBudgetProps extends PopupProps {
  type: BudgetType;
  date?: string; //20241202
  selBudget?: BudgetData | null;
}

interface FormValues {
  amount: string;
  date: string;
}

const NewBudget = (props: NewBudgetProps) => {
  const [categoryOptions, setCategoryOptions] = useState<CategoryData[]>([]);
  const [category, setCategory] = useState<CategoryData | null>(null);
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

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await api.getCategories();
      if (categories.length === 0) {
        message.error("카테고리를 가져오는데 실패했습니다.");
        return;
      }
      setCategoryOptions(categories);
      const foundCat = categories.find(
        (item: CategoryData) => item.value === props.selBudget?.category.value
      );
      if (foundCat) setCategory(foundCat);
      else
        setCategory(
          categories.filter((item: CategoryData) => item.type === props.type)[0]
        );
      console.log("categories", categories);
    };
    fetchCategories();
  }, []);

  const onFinish = async (values: FormValues) => {
    if (parseInt(amount) <= 0 || Number.isNaN(parseInt(amount))) {
      message.error("금액을 확인해주세요.");
      return;
    }
    if (!category) {
      message.error("카테고리를 선택해주세요.");
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
      console.error(e);
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
      {category && (
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
            options={categoryOptions.filter((item) => item.type === props.type)}
            visible={visible}
            confirmText="확인"
            cancelText="취소"
            placeholder="카테고리선택"
            onConfirm={(value: CheckListValue[]) => {
              setVisible(false);
              const g = categoryOptions.find((item) => item.value === value[0]);
              if (g) setCategory(g);
            }}
            onCancel={() => setVisible(false)}
            value={[category.value]}
            defaultValue={[category.value]}
          />
        </Form.Item>
      )}

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
