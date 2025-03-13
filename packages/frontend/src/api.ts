import { message } from "antd";
import axios from "axios";
import { BudgetData, MemoData, TodoData } from "./types";
import { useState } from "react";

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
      : "http://172.30.1.11:3000",
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
  if (error.response) {
    message.error(error.response.data.message);
  } else if (error.message) {
    message.error(`Network error: ${error.message}`);
  } else {
    message.error(error);
  }
}

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
  const response = await http.post(`/api/v1/memos/multiple/${userId}`, {
    memos,
  });
  return response.data;
};

const getMemos = async (userId: number) => {
  const response = await http.get(`/api/v1/memos/${userId}`);
  return response.data;
};

const getPatchNotes = async () => {
  const response = await http.get("/api/v1/patch-notes");
  return response.data;
};

const getCategories = async () => {
  const response = await http.get("/api/v1/categories");
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
  console.log(`isGranted: ${isGranted}`);
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

export const api = {
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
  getNotificationGranted,
  setNotificationGranted,
  sendSurvey,
};
