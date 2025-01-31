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
  showCount?: number;
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
  loginNeed?: boolean;
}

export interface PatchNote {
  id: number;
  title: string;
  description: string;
  version: string;
  created_at: string;
}

export interface KakaoAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_token_expires_in: number;
  id_token: string;
  scope: string;
}

export interface KakaoAuth {
  login: (options: {
    success: (authObj: KakaoAuthResponse) => void;
    fail: (error: Error) => void;
  }) => void;
  logout: (callback?: () => void) => void;
}

export interface KakaoUser {
  id: number;
  kakao_account: {
    profile: {
      nickname: string;
    };
    email: string;
  };
}
