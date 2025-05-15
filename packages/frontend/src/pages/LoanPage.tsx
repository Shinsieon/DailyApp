import { Flex, message, Table } from "antd";
import AppHeader from "../components/AppHeader";
import Label from "../components/Label";
import { Button, Divider, Input, NoticeBar, Segmented } from "antd-mobile";
import sizes from "../sizes";
import { colors, commonFieldStyle } from "../colors";
import { useEffect, useState } from "react";
import { formatMoney, PMT } from "../utils";
import CustomPopup from "../components/CustomPopup";
import MoneyInput from "../components/MoneyInput";
import { AiOutlineDelete } from "react-icons/ai";
import { Loan, LoanForm, LoanRepayment, LoanTypes } from "../types";
import AddRepayment from "../popups/AddRepayment";

interface LoanResult {
  period: number;
  amount: string;
  interest: string;
  principal: string;
  remainingPrincipal: string;
  render?: (value: string) => JSX.Element;
}

const LoanPage = () => {
  const [loanForm, setLoanForm] = useState<LoanForm>({
    type: "원리금균등상환",
    amount: 0,
    interestRate: 0,
    period: 0,
    currentPeriod: 1,
    currentLoanAmount: 0,
  });
  const [popupVisible, setPopupVisible] = useState(false);
  const [loanResult, setLoanResult] = useState<LoanResult[]>([]);
  const [loanRepayment, setLoanRepayment] = useState<LoanRepayment[]>([]);

  const [selType, setSelType] = useState<LoanTypes>("원리금균등상환");
  const repayments = loanRepayment.map((item) => item.period);
  const [notificationShown, setNotificationShown] = useState(true);
  const [prevLoan] = useState<Loan | null>(
    localStorage.getItem("prevLoan")
      ? JSON.parse(localStorage.getItem("prevLoan") as string)
      : null
  );
  const columns = [
    {
      title: "회차",
      dataIndex: "period",
      key: "period",
      width: 60,
      render: (value: number) => {
        return (
          <Label
            name={`${value}`}
            style={{
              fontSize: sizes.font.medium,
              color: repayments.includes(value)
                ? colors.tomato
                : colors.darkBlack,
            }}
          />
        );
      },
    },
    {
      title: "상환금",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "이자",
      dataIndex: "interest",
      key: "interest",
    },
    {
      title: "원금",
      dataIndex: "principal",
      key: "principal",
    },
    {
      title: "잔여원금",
      dataIndex: "remainingPrincipal",
      key: "remainingPrincipal",
    },
  ];
  const calculateLoan = () => {
    const { type, amount, interestRate, period } = loanForm;
    if (!amount || !interestRate || !period) {
      message.error("모든 필드를 입력해주세요.");
      return;
    }
    if (loanForm.currentPeriod > period) {
      message.error("현재 회차는 대출기간보다 작아야 합니다.");
      return;
    }
    if (loanForm.currentPeriod < 1) {
      message.error("현재 회차는 1보다 커야 합니다.");
      return;
    }
    if (loanForm.currentLoanAmount > amount) {
      message.error("현재 대출잔액은 대출금액보다 작아야 합니다.");
      return;
    }
    if (loanForm.currentLoanAmount <= 0) {
      setLoanForm({
        ...loanForm,
        currentLoanAmount: amount,
      });
    }
    const monthlyInterestRate = interestRate / 100 / 12;

    if (type === "원리금균등상환") {
      let monthlyPayment = Number(
        Math.floor(
          Math.abs(
            PMT(
              monthlyInterestRate,
              period - loanForm.currentPeriod,
              loanForm.currentLoanAmount
            )
          )
        )
      );
      const result: LoanResult[] = [];
      let remainingPrincipal = loanForm.currentLoanAmount;
      let newMonthlyInterestRate = monthlyInterestRate;
      for (let i = loanForm.currentPeriod; i < period; i++) {
        for (let j = 0; j < loanRepayment.length; j++) {
          if (loanRepayment[j].period === i) {
            console.log(`재계산됩니다. 회차: ${i}`);
            remainingPrincipal -= loanRepayment[j].amount;
            newMonthlyInterestRate =
              Number(loanRepayment[j].interest) / 100 / 12;
            monthlyPayment = Number(
              Math.floor(
                Math.abs(
                  PMT(newMonthlyInterestRate, period - i, remainingPrincipal)
                )
              )
            );
            break;
          }
        }
        const interest = remainingPrincipal * newMonthlyInterestRate;
        const principal = monthlyPayment - interest;
        remainingPrincipal -= principal;
        result.push({
          period: i,
          amount: formatMoney(monthlyPayment),
          interest: formatMoney(Math.round(interest)),
          principal: formatMoney(Math.round(principal)),
          remainingPrincipal: formatMoney(Math.round(remainingPrincipal)),
        });
      }
      return result;
    } else if (type === "원금균등상환") {
      const result: LoanResult[] = [];
      let remainingPrincipal = loanForm.currentLoanAmount;
      let remainingPeriods = period - loanForm.currentPeriod;
      let newMonthlyInterestRate = monthlyInterestRate;

      for (let i = loanForm.currentPeriod; i < period; i++) {
        // 중도상환 반영
        for (let j = 0; j < loanRepayment.length; j++) {
          if (loanRepayment[j].period === i) {
            remainingPrincipal -= loanRepayment[j].amount;
            newMonthlyInterestRate =
              Number(loanRepayment[j].interest) / 100 / 12;
            remainingPeriods = period - i; // 중도상환 후 남은 기간 재계산
            break;
          }
        }

        // 남은 기간이 0이 되면 반복 종료
        if (remainingPeriods <= 0) break;

        const monthlyPrincipal = remainingPrincipal / remainingPeriods;
        const interest = remainingPrincipal * newMonthlyInterestRate;
        const monthlyPayment = monthlyPrincipal + interest;

        remainingPrincipal -= monthlyPrincipal;
        remainingPeriods--; // 다음 회차로 넘어감

        result.push({
          period: i,
          amount: formatMoney(Math.round(monthlyPayment)),
          interest: formatMoney(Math.round(interest)),
          principal: formatMoney(Math.round(monthlyPrincipal)),
          remainingPrincipal: formatMoney(Math.round(remainingPrincipal)),
        });
      }

      return result;
    } else if (type === "만기일시상환") {
      const result: LoanResult[] = [];
      let remainingPrincipal = loanForm.currentLoanAmount;
      let newMonthlyInterestRate = monthlyInterestRate;

      for (let i = loanForm.currentPeriod; i < period; i++) {
        // 중도상환 반영
        for (let j = 0; j < loanRepayment.length; j++) {
          if (loanRepayment[j].period === i) {
            remainingPrincipal -= loanRepayment[j].amount;
            newMonthlyInterestRate =
              Number(loanRepayment[j].interest) / 100 / 12;
            break;
          }
        }

        const interest = remainingPrincipal * newMonthlyInterestRate;
        const principal = i === period ? remainingPrincipal : 0;
        const monthlyPayment = interest + principal;

        result.push({
          period: i,
          amount: formatMoney(Math.round(monthlyPayment)),
          interest: formatMoney(Math.round(interest)),
          principal: formatMoney(Math.round(principal)),
          remainingPrincipal: formatMoney(
            Math.round(i === period ? 0 : remainingPrincipal)
          ),
        });

        // 마지막 회차에 원금 전액 상환 처리
        if (i === period) {
          remainingPrincipal = 0;
        }
      }

      return result;
    }
  };
  useEffect(() => {
    if (!loanForm.amount) return;
    const result = calculateLoan();

    if (!result) {
      return;
    }
    localStorage.setItem(
      "prevLoan",
      JSON.stringify({
        loanForm: loanForm,
        loanRepayment: loanRepayment,
      })
    );
    message.success("계산결과가 업데이트되었습니다.");
    setLoanResult(result);
  }, [loanRepayment, selType]);
  return (
    <Flex vertical style={{ height: "100vh" }}>
      <AppHeader title="대출 계산기" />

      <Flex vertical style={{ flex: 1, overflow: "auto" }} gap={15}>
        <Flex vertical style={{ padding: "0 20px" }} gap={10}>
          {prevLoan && notificationShown && (
            <NoticeBar
              color="info"
              bordered={false}
              shape="rounded"
              content={"이전 대출 정보가 있어요! 터치해서 불러와보세요."}
              onClick={() => {
                setLoanForm(prevLoan.loanForm);
                setLoanRepayment(prevLoan.loanRepayment);
                setSelType(prevLoan.loanForm.type);
                setNotificationShown(false);
                message.success("이전 대출 정보가 불러와졌습니다.");
              }}
            />
          )}
          <Segmented
            block
            options={["원리금균등상환", "원금균등상환", "만기일시상환"]}
            value={selType}
            onChange={(value) => {
              setSelType(value as LoanTypes);
              setLoanForm({ ...loanForm, type: value as LoanTypes });
            }}
          />
        </Flex>
        <Flex vertical style={{ padding: "0 20px" }} gap={5}>
          <Label
            name="대출금액"
            style={{
              fontSize: sizes.font.medium,
              fontWeight: "bold",
            }}
          />
          <MoneyInput
            placeholder="대출금액 (원)"
            value={loanForm.amount > 0 ? loanForm.amount + "" : ""}
            onChange={(value) => {
              setLoanForm({
                ...loanForm,
                amount: parseInt(value),
                currentLoanAmount: parseInt(value),
              });
            }}
          />

          <Label
            name="대출기간 (개월)"
            style={{
              fontSize: sizes.font.medium,
              fontWeight: "bold",
            }}
          />

          <Flex>
            <Input
              placeholder="대출기간 (개월)"
              inputMode="numeric"
              value={loanForm.period > 0 ? loanForm.period + "" : ""}
              style={commonFieldStyle}
              onChange={(value) => {
                setLoanForm({ ...loanForm, period: parseInt(value) });
              }}
            />
          </Flex>
          <Label
            name="이자율 (%)"
            style={{
              fontSize: sizes.font.medium,
              fontWeight: "bold",
            }}
          />

          <Flex>
            <Input
              placeholder="이자율 (%)"
              inputMode="decimal"
              value={
                loanForm.interestRate > 0 ? loanForm.interestRate + "" : ""
              }
              style={commonFieldStyle}
              onChange={(value) => {
                setLoanForm({ ...loanForm, interestRate: value });
              }}
            />
          </Flex>
          <Label
            name="현재 회차 (개월)"
            style={{
              fontSize: sizes.font.medium,
              fontWeight: "bold",
            }}
          />

          <Flex>
            <Input
              placeholder="현재 회차 (개월), 1부터 시작입니다"
              defaultValue="1"
              inputMode="numeric"
              value={
                loanForm.currentPeriod > 0 ? loanForm.currentPeriod + "" : ""
              }
              style={commonFieldStyle}
              onChange={(value) => {
                setLoanForm({ ...loanForm, currentPeriod: parseInt(value) });
              }}
            />
          </Flex>
          <Label
            name="현재 대출잔액 (원)"
            style={{
              fontSize: sizes.font.medium,
              fontWeight: "bold",
            }}
          />
          <MoneyInput
            placeholder="현재 대출잔액 (원). 빈 값일 경우 대출금액과 동일"
            value={
              loanForm.currentLoanAmount > 0
                ? loanForm.currentLoanAmount + ""
                : ""
            }
            onChange={(value) => {
              setLoanForm({
                ...loanForm,
                currentLoanAmount: parseInt(value),
              });
            }}
          />
        </Flex>
        <Button
          color="primary"
          size="large"
          style={{ margin: 20 }}
          onClick={() => {
            const result = calculateLoan();
            if (!result) {
              return;
            }
            localStorage.setItem(
              "prevLoan",
              JSON.stringify({
                loanForm: loanForm,
                loanRepayment: loanRepayment,
              })
            );
            setLoanResult(result);
          }}
        >
          계산하기
        </Button>
        <Flex vertical style={{ padding: "0 20px" }} gap={15}>
          <Flex justify="space-between">
            <Label
              name="계산결과"
              bold
              style={{ fontSize: sizes.font.large }}
            />
            <Button
              style={{
                backgroundColor: colors.tomato,
                color: colors.lightWhite,
              }}
              size="small"
              fill="none"
              onClick={() => {
                console.log(loanForm);
                setPopupVisible(true);
              }}
            >
              중도 상환
            </Button>
          </Flex>
          {loanRepayment.length > 0 && (
            <Flex vertical gap={10}>
              {loanRepayment.map((item, index) => (
                <Flex
                  justify="space-between"
                  key={index}
                  align="center"
                  style={{
                    fontSize: sizes.font.small,
                    backgroundColor: colors.lightPrimary,
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <Label name={`${item.period}회차(개월)`} />
                  <Divider direction="vertical" />
                  <Label name={`${formatMoney(item.amount)}원`} />
                  <Divider direction="vertical" />
                  <Label name={`${item.interest}%`} />
                  <AiOutlineDelete
                    style={{ fontSize: sizes.font.medium }}
                    onClick={() => {
                      const newLoanRepayment = loanRepayment.filter(
                        (repayment, i) => i !== index
                      );
                      setLoanRepayment(newLoanRepayment);
                      message.success("중도상환이 삭제되었습니다.");
                    }}
                  />
                </Flex>
              ))}
            </Flex>
          )}
          <Table
            key={Math.random()}
            style={{ marginBottom: 20 }}
            columns={columns}
            dataSource={loanResult}
            pagination={false}
            scroll={{ y: 700 }}
            size="small"
          />
        </Flex>
        <CustomPopup
          visible={popupVisible}
          setVisible={setPopupVisible}
          title="중도상환 추가"
          height="60vh"
          children={
            <AddRepayment
              loanForm={loanForm}
              onConfirm={(repayment: LoanRepayment) => {
                setLoanRepayment([...loanRepayment, repayment]);
                setPopupVisible(false);
                message.success("중도상환이 추가되었습니다.");
              }}
            />
          }
        />
      </Flex>
    </Flex>
  );
};
export default LoanPage;
