import { message } from "antd";
import axios from "axios";
import {
  BudgetData,
  CategoryData,
  DiaryData,
  MemoData,
  TodoData,
} from "./types";
import { useState } from "react";
import { sendToTelegram } from "./telegram";

console.log("node env", process.env.NODE_ENV);
// 프로그래스 상태 추가
export const useApiProgress = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  return { progress, setProgress, isLoading, setIsLoading };
};
export const http = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://bono-dev.click"
      : "http://192.168.45.41:3000",
  withCredentials: true,
  beforeRedirect: () => {
    console.log("Redirecting...");
  },
});

// 요청 인터셉터 설정
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 요청 진행률 추적 (업로드)
    config.onUploadProgress = (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload Progress: ${percent}%`);
      }
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function showError(error: any) {
  let errorMsg = "Unknown error";

  if (error.response) {
    errorMsg = error.response.data.message;
    message.error(errorMsg);
  } else if (error.message) {
    errorMsg = `Network error: ${error.message}`;
    message.error(errorMsg);
  } else {
    errorMsg = JSON.stringify(error);
    message.error(errorMsg);
  }

  // 텔레그램 전송 추가
  sendToTelegram(errorMsg);
}

const apiSender = async <T>(
  apiFunc: () => Promise<T>,
  setter: React.Dispatch<React.SetStateAction<T>>
) => {
  try {
    const response = await apiFunc();
    if (!response || (Array.isArray(response) && response.length === 0)) return;

    setter(response);
  } catch (error) {
    showError(error);
  }
};

const getUsers = async () => {
  const response = await http.get("/api/v1/auth/users");
  return response.data;
};

const signin = async (email: string, password: string, type?: string) => {
  const response = await http.post(
    "/api/v1/auth/login",
    { email, password, type },
    { withCredentials: true }
  );
  return response.data;
};

const getProfile = async () => {
  const response = await http.get("/api/v1/auth/me");
  return response.data;
};

const deleteProfile = async () => {
  const response = await http.delete("/api/v1/auth/me");
  return response.data;
};

const signup = async (
  email: string,
  password: string,
  nickname?: string,
  type?: "apple" | "kakao" | "email"
) => {
  const response = await http.post("/api/v1/auth/register", {
    email,
    password,
    nickname,
    type,
  });
  return response.data;
};

const createTodo = async (userId: number, todo: TodoData) => {
  const response = await http.post(`/api/v1/todos/${userId}`, todo);
  return response.data;
};

const getTodos = async (userId: number) => {
  const response = await http.get(`/api/v1/todos/${userId}`);
  return response.data;
};
const syncTodos = async (todos: TodoData[], userId: number) => {
  const response = await http.post(`/api/v1/todos/multiple/${userId}`, {
    todos,
  });
  return response.data;
};

const syncBudgets = async (budgets: BudgetData[], userId: number) => {
  const response = await http.post(`/api/v1/budgets/multiple/${userId}`, {
    budgets,
  });
  return response.data;
};
const getBudgets = async (userId: number) => {
  const response = await http.get(`/api/v1/budgets/${userId}`);
  return response.data;
};

const syncMemos = async (memos: MemoData[], userId: number) => {
  const BATCH_SIZE = 50;
  const results: any[] = [];

  for (let i = 0; i < memos.length; i += BATCH_SIZE) {
    const batch = memos.slice(i, i + BATCH_SIZE);

    console.log(
      `📤 Sending batch ${i / BATCH_SIZE + 1}: ${batch.length} memos`
    );

    const response = await http.post(`/api/v1/memos/multiple/${userId}`, {
      memos: batch,
    });

    results.push(response.data);
  }

  return results.flat(); // 서버가 배열 반환한다고 가정
};

const getMemos = async (userId: number) => {
  const response = await http.get(`/api/v1/memos/${userId}`);
  return response.data;
};

const getPatchNotes = async () => {
  const response = await http.get("/api/v1/patch-notes");
  return response.data;
};

const getCategories = async (userId?: number) => {
  const url = userId ? `/api/v1/categories/${userId}` : `/api/v1/categories`;
  const response = await http.get(url);
  return response.data;
};

const createCategory = async (userId: number, category: CategoryData) => {
  const response = await http.post(`/api/v1/categories/${userId}`, {
    type: category.type,
    name: category.label,
  });
  return response.data;
};

const updateCategory = async (
  userId: number,
  id: number,
  category: CategoryData
) => {
  const response = await http.patch(`/api/v1/categories/${userId}/${id}`, {
    type: category.type,
    name: category.label, // label, value
  });
  return response.data;
};

const deleteCategory = async (userId: number, id: number) => {
  const response = await http.delete(`/api/v1/categories/${userId}/${id}`);
  return response.data;
};

const syncDiaries = async (diaries: DiaryData[], userId: number) => {
  const response = await http.post(`/api/v1/diary/multiple/${userId}`, {
    diaries,
  });
  return response.data;
};

const getDiaries = async (userId: number) => {
  const response = await http.get(`/api/v1/diary/${userId}`);
  return response.data;
};

/*
로그인이 필요한 API 호출
*/
const updateNickname = async (nickname: string) => {
  const response = await http.put("/api/v1/auth/nickname", { nickname });
  return response.data;
};
const getWeather = async (
  date: string,
  nx: number,
  ny: number,
  setProgress?: (p: number) => void
) => {
  const response = await http.get("/api/v1/weather", {
    params: { date, nx, ny },
    onDownloadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (setProgress) setProgress(percent);
      }
    },
  });
  return response.data;
};

const sendSurvey = async (message: string) => {
  const response = await http.post("/api/v1/survey", { message });
  return response.data;
};

const getNotificationGranted = async (userId: number) => {
  const response = await http.get(`/api/v1/noti/${userId}`);
  return response.data;
};

const setNotificationGranted = async (
  userId: number,
  deviceId: string,
  isGranted: boolean
) => {
  if (isGranted) {
    const response = await http.post(`/api/v1/noti/`, {
      userId,
      deviceId,
    });
    return response.data;
  } else {
    const response = await http.delete(`/api/v1/noti/${userId}`);
    return response.data;
  }
};

const getFeed = async (userId: number) => {
  const response = await http.get(`/api/v1/feed/${userId}`);
  return response.data;
};

const getSurvey = async () => {
  const response = await http.get("/api/v1/survey");
  return response.data;
};

export const api = {
  apiSender,
  getUsers,
  signin,
  signup,
  deleteProfile,
  syncTodos,
  createTodo,
  getTodos,
  getBudgets,
  getMemos,
  syncBudgets,
  syncMemos,
  getProfile,
  updateNickname,
  getWeather,
  getPatchNotes,
  getCategories,
  deleteCategory,
  createCategory,
  updateCategory,
  getNotificationGranted,
  setNotificationGranted,
  sendSurvey,
  getFeed,
  getDiaries,
  syncDiaries,
  getSurvey,
};
