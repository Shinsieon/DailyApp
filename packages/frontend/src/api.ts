import { message } from "antd";
import axios from "axios";
import { BudgetData, MemoData, TodoData } from "./types";

console.log("node env", process.env.NODE_ENV);

export const http = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://bono-dev.click"
      : "http://172.30.1.85:3000",
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
  console.log("getting patch notes");
  const response = await http.get("/api/v1/patch-notes");
  console.log(response);
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
const getWeather = async (latitude: number, longitude: number) => {
  //const key =
  "P+/y/R84yS9jBDWOea6o+ooWcZ1t9SRKQaKK23tR2DeF8HGCMh+61cTAFpV71qF7HdooH1nZsvvv8MtVGq71Fw==";
  const key =
    "P%2B%2Fy%2FR84yS9jBDWOea6o%2BooWcZ1t9SRKQaKK23tR2DeF8HGCMh%2B61cTAFpV71qF7HdooH1nZsvvv8MtVGq71Fw%3D%3D";
  const response = await http.get(
    `/api?serviceKey=${key}&numOfRows=10&pageNo=1&base_date=20211001&base_time=0500&nx=${latitude}&ny=${longitude}`
  );
  return response.data;
};

export const api = {
  signin,
  signup,
  deleteProfile,
  syncTodos,
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
};
