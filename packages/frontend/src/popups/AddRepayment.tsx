import { Flex, message } from "antd";
import Label from "../components/Label";
import sizes from "../sizes";
import MoneyInput from "../components/MoneyInput";
import { useState } from "react";
import { LoanForm, LoanRepayment } from "../types";
import { commonFieldStyle } from "../colors";
import { Input } from "antd-mobile";
import BottomFixedButton from "../components/BottomFixedButton";

interface AddRepaymentProps {
  loanForm: LoanForm;
  onConfirm: (repayment: LoanRepayment) => void;
}

const AddRepayment = (props: AddRepaymentProps) => {
  const [newLoanRepayment, setNewLoanRepayment] =
    useState<LoanRepayment | null>();
  return (
    <Flex vertical style={{ padding: 20, width: "100%" }} gap={5}>
      <Label
        name="중도상환금액"
        style={{
          fontSize: sizes.font.medium,
          fontWeight: "bold",
        }}
      />
      <MoneyInput
        placeholder="중도상환금액 (원)"
        value={
          newLoanRepayment && newLoanRepayment.amount > 0
            ? newLoanRepayment.amount + ""
            : ""
        }
        onChange={(value) => {
          setNewLoanRepayment({
            ...newLoanRepayment,
            amount: parseInt(value),
          } as LoanRepayment);
        }}
      />
      <Label
        name="중도상환 회차 (개월)"
        style={{
          fontSize: sizes.font.medium,
          fontWeight: "bold",
        }}
      />
      <Flex>
        <Input
          placeholder="중도상환 회차 (개월)"
          inputMode="numeric"
          style={commonFieldStyle}
          value={
            newLoanRepayment && newLoanRepayment.period > 0
              ? newLoanRepayment.period + ""
              : ""
          }
          onChange={(value) => {
            setNewLoanRepayment({
              ...newLoanRepayment,
              period: parseInt(value),
            } as LoanRepayment);
          }}
        />
      </Flex>
      <Label
        name="이자율 변동 (%)"
        style={{
          fontSize: sizes.font.medium,
          fontWeight: "bold",
        }}
      />
      <Flex>
        <Input
          placeholder="이자율 변동 (%). 빈 값일 경우 현재 이자율과 동일"
          inputMode="decimal"
          value={
            newLoanRepayment && Number(newLoanRepayment.interest) > 0
              ? newLoanRepayment.interest + ""
              : ""
          }
          onChange={(value) => {
            setNewLoanRepayment({
              ...newLoanRepayment,
              interest: value,
            } as LoanRepayment);
          }}
          style={commonFieldStyle}
        />
      </Flex>
      <BottomFixedButton
        type="single"
        onConfirm={() => {
          if (!newLoanRepayment) {
            message.error("모든 필드를 입력해주세요.");
            return;
          }
          if (newLoanRepayment.period > props.loanForm.period) {
            message.error("중도상환 회차는 대출기간보다 작아야 합니다.");
            return;
          }
          if (newLoanRepayment.period < 1) {
            message.error("중도상환 회차는 1보다 커야 합니다.");
            return;
          }
          if (newLoanRepayment.amount > props.loanForm.amount) {
            message.error("중도상환금액은 대출금액보다 작아야 합니다.");
            return;
          }
          if (!newLoanRepayment.interest) {
            console.log("이자율이 비어있습니다.");
            console.log(props.loanForm.interestRate);
            newLoanRepayment.interest = props.loanForm.interestRate + "";
          }
          if (Number(newLoanRepayment.interest) < 0) {
            message.error("이자율은 0보다 커야 합니다.");
            return;
          }

          props.onConfirm(newLoanRepayment);
          setNewLoanRepayment(null);
        }}
        confirmName="추가하기"
      />
    </Flex>
  );
};

export default AddRepayment;
