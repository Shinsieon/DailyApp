import { useLocation, useNavigate } from "react-router-dom";
import { Flex, message } from "antd";
import AppHeader from "../components/AppHeader";
import {
  Cascader,
  DatePicker,
  DatePickerRef,
  Form,
  Input,
  Modal,
} from "antd-mobile";
import { BudgetData, CategoryData } from "../types";
import BottomFixedButton from "../components/BottomFixedButton";
import { useBudgetStore } from "../store/budgetStore";
import { RefObject, useEffect, useState } from "react";
import { api } from "../api";
import dayjs from "dayjs";
import Label from "../components/Label";
import { CheckListValue } from "antd-mobile/es/components/check-list";
import { translateToKorean } from "../utils";
import { colors } from "../colors";

const BudgetEditPage = () => {
  const location = useLocation();
  const budgetId = location.state?.budgetId;
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { budgets, updateBudget, saveBudget, deleteBudget } = useBudgetStore();
  const prevBudget = budgets.find((budget) => budget.id === budgetId);
  const defaultBudget: BudgetData = {
    date: location.state?.date,
    amount: 0,
    type: location.state?.type || "expense",
    category: { label: "", value: "", type: "" },
    other: "",
  };
  const [budgetForm, setBudgetForm] = useState<BudgetData>(
    prevBudget || defaultBudget
  );
  console.log(
    `budgetForm : ${JSON.stringify(budgetForm)} isPrev : ${JSON.stringify(
      prevBudget
    )}`
  );

  const [form] = Form.useForm();
  const [categoryOptions, setCategoryOptions] = useState<CategoryData[]>([]);
  const onfinish = async () => {
    console.log(`budgetForm : ${JSON.stringify(budgetForm)}`);
    if (!budgetForm.amount || budgetForm.amount <= 0) {
      message.error("금액을 입력해주세요.");
      return;
    }
    try {
      if (prevBudget) {
        await updateBudget(budgetForm);
      } else {
        await saveBudget(budgetForm);
      }
    } catch (e) {
      message.error("데이터를 저장하는데 실패했습니다.");
      return;
    }
    message.success(
      `${budgetForm.type === "income" ? "수입" : "지출"}이 저장되었습니다.`
    );
    navigate(-1);
  };
  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await api.getCategories();
      if (categories.length === 0) {
        message.error("카테고리를 가져오는데 실패했습니다.");
        return;
      }
      setCategoryOptions(categories);
      const foundCat = categories.find(
        (item: CategoryData) => item.value === budgetForm.category.value
      );
      if (foundCat) setBudgetForm({ ...budgetForm, category: foundCat });
      else
        setBudgetForm({
          ...budgetForm,
          category: categories.filter(
            (item: CategoryData) => item.type === budgetForm.type
          )[0],
        });
    };
    fetchCategories();
  }, []);
  return (
    <Flex vertical style={{ height: "100vh" }}>
      <AppHeader
        title={`${budgetForm.type === "income" ? "수입" : "지출"}기록`}
      />
      <Flex vertical style={{ flex: 1, overflowY: "auto" }}>
        <Form
          form={form}
          footer={
            <Flex>
              <BottomFixedButton
                type="double"
                onConfirm={onfinish}
                onCancel={() => {
                  if (prevBudget) {
                    Modal.confirm({
                      content: `${
                        prevBudget.type === "income" ? "수입" : "지출"
                      }을 삭제하시겠습니까?`,
                      confirmText: "삭제",
                      cancelText: "취소",
                      onConfirm: async () => {
                        deleteBudget(prevBudget.id!);
                        message.success(
                          `${
                            prevBudget.type === "income" ? "수입" : "지출"
                          }이 삭제되었습니다.`
                        );
                        navigate(-1);
                      },
                    });
                  } else {
                    navigate(-1);
                  }
                }}
                confirmName={prevBudget ? "수정" : "저장"}
                cancelName={prevBudget ? "삭제" : "취소"}
              />
            </Flex>
          }
          style={{ height: "300px" }}
          onFinish={onfinish}
        >
          <Form.Item
            name="amount"
            label="금액"
            rules={[{ required: true, message: "금액을 입력해주세요" }]}
            extra={"₩"}
          >
            <Flex vertical>
              {budgetForm.amount > 0 && (budgetForm.amount + "").length > 0 && (
                <Label
                  name={
                    translateToKorean(parseInt(budgetForm.amount + "")) + "원"
                  }
                  style={{ color: colors.primary }}
                />
              )}
              <Input
                placeholder="금액입력"
                inputMode="numeric"
                value={budgetForm.amount > 0 ? budgetForm.amount + "" : ""}
                onChange={(value) => {
                  setBudgetForm({ ...budgetForm, amount: parseInt(value) });
                }}
              />
            </Flex>
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
                setBudgetForm({
                  ...budgetForm,
                  date: dayjs(value).format("YYYYMMDD"),
                });
              }}
            >
              {() => dayjs(budgetForm.date).format("YYYY-MM-DD")}
            </DatePicker>
          </Form.Item>
          {budgetForm.category && (
            <Form.Item
              label="카테고리"
              rules={[{ required: true, message: "카테고리를 선택해주세요" }]}
              onClick={() => setVisible(true)}
            >
              <Label name={budgetForm.category.label} />
              <Cascader
                options={categoryOptions.filter(
                  (item) => item.type === budgetForm.type
                )}
                visible={visible}
                confirmText="확인"
                cancelText="취소"
                placeholder="카테고리선택"
                onConfirm={(value: CheckListValue[]) => {
                  setVisible(false);
                  const g = categoryOptions.find(
                    (item) => item.value === value[0]
                  );
                  if (g) setBudgetForm({ ...budgetForm, category: g });
                }}
                onCancel={() => setVisible(false)}
                value={[budgetForm.category.value]}
                defaultValue={[budgetForm.category.value]}
              />
            </Form.Item>
          )}

          <Form.Item
            label="기타"
            rules={[{ required: false, message: "상세 내역을 남겨주세요" }]}
          >
            <Input
              placeholder="기타 내용"
              value={budgetForm.other}
              onChange={(value) => {
                setBudgetForm({ ...budgetForm, other: value });
              }}
            />
          </Form.Item>
        </Form>
      </Flex>
    </Flex>
  );
};

export default BudgetEditPage;
