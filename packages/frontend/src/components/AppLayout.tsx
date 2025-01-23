import { useEffect } from "react";
import { useBudgetStore } from "../store/budgetStore";
import { useTodoStore } from "../store/todoStore";
import ErrorBoundary from "./ErrorBoundary";
import { useMemoStore } from "../store/memoStore";
import { Flex } from "antd";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";

export const AppLayout = ({ children }: { children: React.ReactElement }) => {
  const isDarkMode = useThemeStore((state) => state.theme.isDarkMode);

  const fetchBudgets = useBudgetStore((state) => state.fetchBudgets);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const fetchMemos = useMemoStore((state) => state.fetchMemos);
  const fetchTheme = useThemeStore((state) => state.fetchTheme);

  useEffect(() => {
    fetchBudgets();
    fetchTodos();
    fetchMemos();
    fetchTheme();
  }, []);
  return (
    <Flex
      vertical
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        overflow: "hidden",
        backgroundColor: isDarkMode ? colors.darkBlack : colors.lightWhite,
        color: isDarkMode ? colors.lightWhite : colors.darkBlack,
      }}
    >
      <ErrorBoundary>{children}</ErrorBoundary>
    </Flex>
  );
};
