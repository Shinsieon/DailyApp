import { Calendar, Flex } from "antd";
import AppHeader from "../components/AppHeader";
import dayjs, { Dayjs } from "dayjs";
import { formatMoney } from "../utils";
import { useBudgetStore } from "../store/budgetStore";
import { colors } from "../colors";
import Label from "../components/Label";
import { useNavigate } from "react-router-dom";
import { FaChartPie } from "react-icons/fa";
import sizes from "../sizes";
import CustomPopup from "../components/CustomPopup";
import DetailBudget from "../popups/DetailBudget";
import { SelectInfo } from "antd/es/calendar/generateCalendar";
import { useBudgetUIStore } from "../store/budgetUIStore";

const BudgetPage = () => {
  const { selDate, setSelDate, detailVisible, setDetailVisible } =
    useBudgetUIStore();
  const navigate = useNavigate();
  const { budgets } = useBudgetStore();

  const handleComplete = () => {
    console.log("가계부 정리 완료");
    setDetailVisible(true);
  };

  const renderBudget = (date: Dayjs, info: any) => {
    if (info.type === "date") {
      return renderBudgetForDate(date);
    } else if (info.type === "month") {
      return renderBudgetForMonth(date);
    }
  };
  const renderBudgetForMonth = (date: Dayjs) => {
    const monthlyBudget = budgets.filter((budget) => {
      return (
        date.isSame(dayjs(budget.date), "month") &&
        budget.date.substring(0, 6) === date.format("YYYYMM")
      );
    });
    const monthlyIncomeSum = monthlyBudget
      .filter((b) => b.type === "income")
      .reduce((acc, b) => acc + b.amount, 0);
    const monthlyExpenseSum = monthlyBudget
      .filter((b) => b.type === "expense")
      .reduce((acc, b) => acc + b.amount, 0);
    return (
      <Flex vertical gap={5}>
        <Label
          name={`수입 ${formatMoney(monthlyIncomeSum)}원`}
          style={{
            fontSize: sizes.font.small,
            borderLeft: `4px solid ${colors.lightTomato}`,
            paddingLeft: 10,
          }}
        />
        <Label
          name={`지출 ${formatMoney(monthlyExpenseSum)}원`}
          style={{
            fontSize: sizes.font.small,
            borderLeft: `4px solid ${colors.lightPrimary}`,
            paddingLeft: 10,
          }}
        />
      </Flex>
    );
  };

  const renderBudgetForDate = (date: Dayjs) => {
    const dailyBudgets = budgets.filter((budget) => {
      return date.isSame(dayjs(budget.date), "day");
    });
    const dailyIncomeSum = dailyBudgets
      .filter((b) => b.type === "income")
      .reduce((acc, b) => acc + b.amount, 0);

    const dailyExpenseSum = dailyBudgets
      .filter((b) => b.type === "expense")
      .reduce((acc, b) => acc + b.amount, 0);
    return (
      <Flex vertical gap={5}>
        {dailyIncomeSum > 0 ? (
          <Label
            name={`${formatMoney(dailyIncomeSum)}`}
            style={{
              fontSize: sizes.font.xsmall,
              borderLeft: `2px solid ${colors.lightTomato}`,
              paddingLeft: 2,
            }}
          />
        ) : (
          <></>
        )}
        {dailyExpenseSum > 0 ? (
          <Label
            name={`${formatMoney(dailyExpenseSum)}`}
            style={{
              fontSize: sizes.font.xsmall,
              borderLeft: `2px solid ${colors.lightPrimary}`,
              paddingLeft: 2,
            }}
          />
        ) : (
          <></>
        )}
      </Flex>
    );
  };
  return (
    <Flex vertical style={{ height: "100vh" }}>
      {/* 100vh 지우지말것 */}
      <AppHeader
        title="가계부 정리"
        right={
          <FaChartPie
            style={{
              fontSize: 20,
              paddingRight: 10,
            }}
            onClick={() => {
              navigate("/budgetChartPage");
            }}
          />
        }
      />
      <Flex
        vertical
        style={{ flex: 1, overflowY: "auto", padding: "0px 20px" }}
      >
        <Calendar
          value={dayjs(selDate)}
          cellRender={renderBudget}
          onSelect={(date: Dayjs, selectInfo: SelectInfo) => {
            setSelDate(date.format("YYYYMMDD"));
            if (selectInfo.source === "date") {
              setDetailVisible(true);
            }
          }}
        />
      </Flex>
      <CustomPopup
        visible={detailVisible}
        setVisible={setDetailVisible}
        title={`${dayjs(selDate).format("MM월 DD일")} 가계부`}
        height="60vh"
        children={<DetailBudget handleComplete={handleComplete} />}
      />
    </Flex>
  );
};
export default BudgetPage;
