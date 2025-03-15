import { Button, Flex, Form, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, showError } from "../api";
import Title from "../components/Title";
import AppHeader from "../components/AppHeader";
import { Checkbox, Divider } from "antd-mobile";
import { colors } from "../colors";
import { KakaoAuthResponse, KakaoUser } from "../types";
import { useUserStore } from "../store/userStore";
import { IoChatbubbleSharp } from "react-icons/io5";
import TextField from "../components/TextField";
import { AppleFilled } from "@ant-design/icons";
import { isNative, sendToNative } from "../hooks/useNative";
const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  // 공통 로그인 처리 함수
  const handleLogin = async (
    email: string,
    password: string,
    nickname?: string,
    type?: "kakao" | "email" | "apple"
  ) => {
    setLoading(true);
    try {
      const response = await api.signin(email, password, type);
      message.success("로그인이 완료되었습니다.");
      if (localStorage.getItem("rememberEmail") === "true")
        localStorage.setItem("email", email);
      localStorage.setItem("token", response.access_token);
      setUser(response.user);
      navigate("/");
    } catch (error: any) {
      //401 Unauthorized
      if (error.response?.status === 401) {
        showError(error);
      } else if (error.response?.status === 404) {
        if (type === "kakao") {
          //자동회원가입 후 로그인까지
          let response = await api.signup(email, password, nickname);
          response = await api.signin(email, password);
          localStorage.setItem("token", response.access_token);
          setUser(response.user);
          message.success("카카오 계정으로 회원가입이 완료되었습니다.");
          navigate("/");
        } else if (type === "apple") {
          let response = await api.signup(email, password, nickname, type);
          response = await api.signin(email, password, type);
          localStorage.setItem("token", response.access_token);
          setUser(response.user);
          message.success("애플 계정으로 회원가입이 완료되었습니다.");
          navigate("/");
        } else {
          showError("가입되지 않은 이메일입니다.");
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const handleKakaoLogin = () => {
    if (!window.Kakao) {
      message.error("Kakao SDK가 로드되지 않았습니다.");
      return;
    }
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_APP_KEY); // Replace with your Kakao JavaScript Key
    }
    window.Kakao.Auth.login({
      success: async (authObj: KakaoAuthResponse) => {
        window.Kakao.API.request({
          url: "/v2/user/me",
          success: async (res: KakaoUser) => {
            //기존 사용자 로그인 시도
            await handleLogin(
              res.kakao_account.email,
              res.id.toString(),
              res.kakao_account.profile.nickname,
              "kakao"
            );
          },
          fail: (error) => {
            console.error("Failed to fetch user info:", error);
            showError(error);
          },
        });
      },
      fail: (error) => {
        console.error("Kakao login failed:", error);
        showError(error);
      },
    });
  };
  console.log("로그인 화면 렌더링[no effect]");
  return (
    <Flex vertical>
      <AppHeader title="로그인" />
      <Flex style={{ padding: "0 20px" }} vertical>
        <Form
          name="login"
          onFinish={(values) => handleLogin(values.email, values.password)}
        >
          <Title level={5} name="이메일" />
          <Form.Item
            name="email"
            initialValue={localStorage.getItem("email") || ""}
            rules={[{ required: true, message: "이메일을 입력해주세요" }]}
          >
            <TextField placeholder="email@naver.com" autoComplete="email" />
          </Form.Item>
          <Title level={5} name="비밀번호" />
          <Form.Item
            name="password"
            rules={[{ required: true, message: "비밀번호를 입력해주세요" }]}
          >
            <TextField
              placeholder="******"
              type="password"
              style={{ height: 50 }}
              autoComplete="current-password"
            />
          </Form.Item>
          <Form.Item>
            <Checkbox
              defaultChecked={localStorage.getItem("rememberEmail") === "true"}
              onChange={(value) => {
                console.log("체크박스 클릭", value);
                if (value) localStorage.setItem("rememberEmail", "true");
                else localStorage.removeItem("rememberEmail");
              }}
            >
              로그인 정보 기억하기
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: "100%",
                height: 50,
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              로그인
            </Button>
          </Form.Item>
          <Flex justify="center">
            <Button
              type="link"
              style={{ color: colors.darkGray }}
              onClick={() => {
                message.info("비밀번호 찾기 기능은 준비중입니다.");
              }}
            >
              비밀번호 찾기
            </Button>
            <Button
              type="link"
              style={{ color: colors.darkGray }}
              onClick={() => {
                navigate("/register");
              }}
            >
              회원가입
            </Button>
          </Flex>
          <Divider style={{ marginTop: 30, marginBottom: 30 }} />
          <Form.Item style={{ marginBottom: 10 }}>
            <Button
              style={{
                backgroundColor: "#FEE000",
                width: "100%",
                height: 50,
                border: "none",
                fontWeight: "bold",
              }}
              icon={<IoChatbubbleSharp />}
              name="kakao"
              onClick={() => {
                if (isNative()) {
                  sendToNative("kakaoLogin", {}, async (data: any) => {
                    console.log("🔵 카카오 로그인 요청을 전송했습니다.");
                    console.log(data);
                    await handleLogin(
                      data.user.email,
                      data.user.id.toString(),
                      data.user.nickname,
                      "kakao"
                    );
                  });
                  //message.info("카카오 로그인 기능은 준비중입니다.");
                } else {
                  handleKakaoLogin();
                }
              }}
            >
              카카오로 시작하기
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "black",
                color: "white",
                border: "none",
                fontWeight: "bold",
                transition: "background 0.3s",
                width: "100%",
                height: 50,
              }}
              icon={<AppleFilled />}
              onClick={() => {
                sendToNative("appleLogin", {}, async (data: any) => {
                  console.log("🔵 애플 로그인 요청을 전송했습니다.");
                  console.log(data);
                  await handleLogin(
                    data.token,
                    data.user.id.toString(),
                    data.user.nickname,
                    "apple"
                  );
                });
              }}
            >
              애플로 시작하기
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
