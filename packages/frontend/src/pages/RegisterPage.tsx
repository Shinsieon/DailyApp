import { Button, Flex, Form, message } from "antd";
import Title from "../components/Title";
import { api, showError } from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { Input } from "antd-mobile";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (values: {
    email: string;
    password: string;
    nickname: string;
  }) => {
    setLoading(true);
    try {
      await api.signup(values.email, values.password, values.nickname);
      message.success("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Flex vertical>
      <AppHeader title="회원가입" />
      <Flex style={{ padding: "0 20px" }} vertical>
        <Form name="login" onFinish={onFinish}>
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
            <Input
              type="password"
              placeholder="Password"
              style={{ height: 50 }}
              autoComplete="current-password"
            />
          </Form.Item>
          <Title level={5} name="닉네임" />
          <Form.Item
            name="nickname"
            rules={[{ required: true, message: "닉네임을 입력해주세요" }]}
          >
            <Input
              placeholder="Nickname"
              style={{ height: 50 }}
              autoComplete="nickname"
            />
          </Form.Item>
          <Form.Item style={{ marginTop: 50 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%", height: 50 }}
            >
              회원가입
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Flex>
  );
};

export default RegisterPage;
