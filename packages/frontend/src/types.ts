export interface PopupProps {
  title?: string;
  open?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}
export type BudgetType = "income" | "expense" | "all";
export type AllowedManipulateType = "day" | "month" | "year";
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
  time?: string;
  notification?: string;
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
  relatedMemoIds?: number[];
}

export interface Diary {
  title: string;
  content: string;
}
export interface DiaryData {
  id?: number;
  date: string;
  diaries: Diary[];
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
  createdAt: string;
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

export enum WeatherCategory {
  VEC = "VEC", // 풍향
  WSD = "WSD", // 풍속
  REH = "REH", // 습도
  PTY = "PTY", // 강수형태
  POP = "POP", // 강수확률
  PCP = "PCP", // 강수량
  SNO = "SNO", // 눈
  SKY = "SKY", // 하늘상태
  TMP = "TMP", // 기온
  UUU = "UUU", // 동서바람성분
  VVV = "VVV", // 남북바람성분
  WAV = "WAV", // 파고
}
export interface WeatherProps {
  baseDate: string;
  baseTime: string;
  category: WeatherCategory;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}
export interface WeatherMap {
  fcstTime: string; // 예보 시간 (ex: "0500", "0700", ...)
  [key: string]: string; // 날씨 데이터 (카테고리 키-값 매핑)
}

export type FeedCategory = "음악" | "책" | "에피소드" | "여행" | "기타";

export interface Feed {
  id: number;
  title: string;
  category: FeedCategory;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    profileImage: string;
  };
  comments: {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: number;
      name: string;
      profileImage: string;
    };
    feedId: number;
  }[];
  likes: {
    id: number;
    feedId: number;
    createdAt: string;
    updatedAt: string;
    user: {
      id: number;
      name: string;
      profileImage: string;
    };
  }[];
  images?: {
    id: string;
    url: string;
    createdAt: string;
    updatedAt: string;
    feedId: number;
    user: {
      id: string;
      name: string;
      profileImage: string;
    };
  };
}
