import { Button, Flex, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, showError } from "../api";
import Title from "../components/Title";
import AppHeader from "../components/AppHeader";
import { Divider, Image } from "antd-mobile";
import kakao from "../assets/kakao.png";
import { colors } from "../colors";
import { KakaoAuthResponse, KakaoUser } from "../types";
import { useUserStore } from "../store/userStore";
const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  // 공통 로그인 처리 함수
  const handleLogin = async (
    email: string,
    password: string,
    nickname?: string,
    type?: "kakao" | "email"
  ) => {
    setLoading(true);
    try {
      const response = await api.signin(email, password);
      message.success("로그인이 완료되었습니다.");
      localStorage.setItem("token", response.data.access_token);
      setUser(response.data.user);
      navigate("/");
    } catch (error: any) {
      //401 Unauthorized
      if (error.response?.status === 401) {
        showError(error);
      } else if (error.response?.status === 404) {
        showError("가입되지 않은 이메일입니다.");
        if (type === "kakao") {
          //자동회원가입 후 로그인까지
          const response = await api.signup(email, password, nickname);
          localStorage.setItem("token", response.data.access_token);
          setUser(response.data.user);
          message.success("카카오 계정으로 회원가입이 완료되었습니다.");
          navigate("/");
        } else {
          navigate("/register");
        }
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Initialize Kakao SDK
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_APP_KEY); // Replace with your Kakao JavaScript Key
    }
  }, []);
  // 카카오 로그인 처리
  const handleKakaoLogin = () => {
    if (!window.Kakao) {
      message.error("Kakao SDK가 로드되지 않았습니다.");
      return;
    }

    window.Kakao.Auth.login({
      success: async (authObj: KakaoAuthResponse) => {
        console.log("Kakao login successful:", authObj);

        window.Kakao.API.request({
          url: "/v2/user/me",
          success: async (res: KakaoUser) => {
            console.log("User Info:", res);

            // 기존 사용자 로그인 시도
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

  return (
    <Form
      name="login"
      onFinish={(values) => handleLogin(values.email, values.password)}
    >
      <Title level={5} name="이메일" />
      <Form.Item
        name="email"
        rules={[{ required: true, message: "이메일을 입력해주세요" }]}
      >
        <Input
          placeholder="Email"
          style={{ height: 50 }}
          autoComplete="email"
        />
      </Form.Item>
      <Title level={5} name="비밀번호" />
      <Form.Item
        name="password"
        rules={[{ required: true, message: "비밀번호를 입력해주세요" }]}
      >
        <Input.Password
          placeholder="Password"
          style={{ height: 50 }}
          autoComplete="current-password"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ width: "100%", height: 50 }}
        >
          로그인
        </Button>
      </Form.Item>
      <Flex justify="center">
        <Button
          type="link"
          style={{ color: colors.darkGray }}
          onClick={() => {
            navigate("/find-password");
          }}
        >
          비밀번호 찾기
        </Button>
        <Divider />
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
      <Form.Item>
        <Image
          src={kakao}
          width={"100%"}
          height={50}
          fit="fill"
          onClick={handleKakaoLogin}
        />
      </Form.Item>
    </Form>
  );
};

const LoginPage = () => {
  return (
    <Flex vertical>
      <AppHeader title="로그인" />
      <Flex style={{ padding: "0 20px" }} vertical>
        <LoginForm />
      </Flex>
    </Flex>
  );
};

export default LoginPage;
