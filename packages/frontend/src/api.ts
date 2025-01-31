import { message } from "antd";
import axios from "axios";

console.log("node env", process.env.NODE_ENV);

export const http = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://bono-dev.click"
      : "http://localhost:3000",
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

const signin = async (email: string, password: string) => {
  const response = await http.post(
    "/api/v1/auth/login",
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};

const getProfile = async () => {
  const response = await http.get("/api/v1/auth/me");
  return response.data;
};

const signup = async (email: string, password: string, nickname?: string) => {
  const response = await http.post("/api/v1/auth/register", {
    email,
    password,
    nickname,
  });
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
  getProfile,
  updateNickname,
  getWeather,
  getPatchNotes,
  getCategories,
};
