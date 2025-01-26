import { useEffect } from "react";
import { useBudgetStore } from "../store/budgetStore";
import { useTodoStore } from "../store/todoStore";
import ErrorBoundary from "./ErrorBoundary";
import { useMemoStore } from "../store/memoStore";
import { Flex } from "antd";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";
import useIsMobile from "../hooks/useIsMobile";

export const AppLayout = ({ children }: { children: React.ReactElement }) => {
  const isDarkMode = useThemeStore((state) => state.theme.isDarkMode);
  const isMobile = useIsMobile();

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
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        overflow: "hidden",
        backgroundColor: isDarkMode ? colors.darkBlack : colors.lightWhite,
        color: isDarkMode ? colors.lightWhite : colors.darkBlack,
      }}
      justify="center"
    >
      <Flex vertical style={{ width: isMobile ? "100vw" : "640px" }}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </Flex>
    </Flex>
  );
};
