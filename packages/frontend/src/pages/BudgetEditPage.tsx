import { useLocation, useNavigate } from "react-router-dom";
import { Button, Flex, message } from "antd";
import AppHeader from "../components/AppHeader";
import {
  Cascader,
  DatePicker,
  DatePickerRef,
  Input,
  Modal,
  Segmented,
} from "antd-mobile";
import { BudgetData, CategoryData } from "../types";
import BottomFixedButton from "../components/BottomFixedButton";
import { useBudgetStore } from "../store/budgetStore";
import { useEffect, useRef, useState } from "react";
import { api } from "../api";
import dayjs from "dayjs";
import Label from "../components/Label";
import { CheckListValue } from "antd-mobile/es/components/check-list";
import { translateToKorean } from "../utils";
import { colors, commonFieldStyle } from "../colors";
import { useUserStore } from "../store/userStore";
import sizes from "../sizes";
import { FaCirclePlus } from "react-icons/fa6";

const BudgetEditPage = () => {
  const location = useLocation();
  const budgetId = location.state?.budgetId;
  const [visible, setVisible] = useState(false);
  const datePickerRef = useRef<DatePickerRef>(null);
  const navigate = useNavigate();
  const { budgets, updateBudget, saveBudget, deleteBudget } = useBudgetStore();
  const prevBudget = budgets.find((budget) => budget.id === budgetId);
  const user = useUserStore((state) => state.user);
  const defaultCategory = { label: "", value: "", type: "" };
  const defaultBudget: BudgetData = {
    date: location.state?.date,
    amount: 0,
    type: location.state?.type || "expense",
    category: defaultCategory,
    other: "",
  };
  const [budgetForm, setBudgetForm] = useState<BudgetData>(
    prevBudget || defaultBudget
  );

  const [categoryOptions, setCategoryOptions] = useState<CategoryData[]>([]);
  const onfinish = async () => {
    if (!budgetForm.amount || budgetForm.amount <= 0) {
      message.error("금액을 입력해주세요.");
      return;
    }
    if (!budgetForm.category || !budgetForm.category.value) {
      message.error("카테고리를 선택해주세요.");
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
      const categoryType = localStorage.getItem("category");
      let categories = [];
      if (categoryType === "default") {
        categories = await api.getCategories();
      } else {
        categories = await api.getCategories(user?.id);
      }
      if (categories.length === 0) {
        message.error("카테고리를 가져오는데 실패했습니다.");
        return;
      }
      for (let i = 0; i < categories.length; i++) {
        categories[i].value = categories[i].label;
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
      <Flex
        vertical
        style={{ flex: 1, overflowY: "auto", padding: "20px" }}
        gap={15}
      >
        <Flex vertical gap={5}>
          <Segmented
            options={["수입", "지출"]}
            block
            value={budgetForm.type === "income" ? "수입" : "지출"}
            onChange={(value) => {
              const cat = categoryOptions.filter(
                (item) =>
                  item.type === (value === "수입" ? "income" : "expense")
              )[0];
              setBudgetForm({
                ...budgetForm,
                type: value === "수입" ? "income" : "expense",
                category: cat ? cat : defaultCategory,
              });
            }}
          />
          <Label
            name="금액"
            style={{
              fontSize: sizes.font.medium,
              fontWeight: "bold",
            }}
          />

          <Flex>
            <Input
              placeholder="금액입력"
              inputMode="numeric"
              value={budgetForm.amount > 0 ? budgetForm.amount + "" : ""}
              style={commonFieldStyle}
              onChange={(value) => {
                setBudgetForm({ ...budgetForm, amount: parseInt(value) });
              }}
            />
          </Flex>
          {budgetForm.amount > 0 && (budgetForm.amount + "").length > 0 && (
            <Label
              name={translateToKorean(parseInt(budgetForm.amount + "")) + "원"}
              style={{ color: colors.primary, textAlign: "right" }}
            />
          )}
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
              value={dayjs(budgetForm.date).format("YYYY-MM-DD")}
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
              setBudgetForm({
                ...budgetForm,
                date: dayjs(value).format("YYYYMMDD"),
              });
            }}
          />
        </Flex>
        <Flex vertical gap={5}>
          <Flex gap={10} align="center">
            <Label
              name="카테고리"
              style={{
                fontSize: sizes.font.medium,
                fontWeight: "bold",
              }}
            />

            <FaCirclePlus
              style={{ fontSize: sizes.font.medium }}
              onClick={() => {
                if (!user) {
                  message.error("로그인 후 사용해주세요.");
                  return;
                }
                navigate("/categoryListPage");
              }}
            />
          </Flex>
          <Flex>
            <Input
              style={commonFieldStyle}
              value={budgetForm.category?.label}
              onClick={() => {
                setVisible(true);
              }}
            />
          </Flex>
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
              const g = categoryOptions.find((item) => item.value === value[0]);
              if (g) setBudgetForm({ ...budgetForm, category: g });
            }}
            onCancel={() => setVisible(false)}
            value={[budgetForm.category?.value]}
            defaultValue={[budgetForm.category?.value]}
          />
        </Flex>
        <Flex vertical gap={5}>
          <Label
            name="상세"
            style={{
              fontSize: sizes.font.medium,
              fontWeight: "bold",
            }}
          />
          <Flex>
            <Input
              placeholder="상세 내용"
              value={budgetForm.other}
              style={commonFieldStyle}
              onChange={(value) => {
                setBudgetForm({ ...budgetForm, other: value });
              }}
            />
          </Flex>
        </Flex>
      </Flex>
      <BottomFixedButton
        confirmName={prevBudget ? "수정" : "저장"}
        type="double"
        cancelName={prevBudget ? "삭제" : "취소"}
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
      />
    </Flex>
  );
};

export default BudgetEditPage;
