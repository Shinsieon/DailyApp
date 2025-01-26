export interface LoginResponse {
  message: string;
}

export interface PopupProps {
  title?: string;
  open?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}
export type BudgetType = "income" | "expense";
export interface BudgetData {
  id?: number;
  date: string;
  category: { label: string; value: string; type: string };
  amount: number;
  type: BudgetType;
  other?: string;
}
export interface CategoryData {
  id?: number;
  type: string;
  label: string;
  value: string;
}
export type BudgetSum = {
  income: number;
  expense: number;
};

export interface TodoData {
  id?: number;
  title: string;
  date: string;
  completed: boolean;
}

export interface MemoData {
  id?: number;
  group: string;
  title: string;
  content: string;
  date: string;
  favorite: boolean;
  secret: boolean;
}

export interface ThemeData {
  isDarkMode: boolean;
}

export interface Menu {
  name: string;
  path: string;
  icon: React.ReactNode;
  selIcon: React.ReactNode;
  element: React.ReactNode;
}

export interface PatchNote {
  id: number;
  title: string;
  description: string;
  version: string;
  created_at: string;
}
