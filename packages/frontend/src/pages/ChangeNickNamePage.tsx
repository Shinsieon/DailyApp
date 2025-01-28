import { Button, Flex, message } from "antd";
import { Form, Input } from "antd-mobile";
import AppHeader from "../components/AppHeader";
import { useUserStore } from "../store/userStore";
import { api, showError } from "../api";

const ChangeNickNamePage = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const handleChangeNickName = async (values: any) => {
    console.log(values);
    try {
      const newUser = await api.updateNickname(values.newNickName);
      message.success("닉네임이 변경되었습니다.");
      setUser(newUser.data);
    } catch (e) {
      showError(e);
    }
  };
  return (
    <Flex vertical>
      {/* 100vh 지우지말것 */}
      <AppHeader title="닉네임 변경" />
      <Flex vertical style={{ flex: 1, overflowY: "auto" }}>
        <Form name="form" onFinish={handleChangeNickName} style={{ flex: 1 }}>
          <Form.Item name="prevNickName" label="이전 닉네임">
            <Input
              style={{ height: 50 }}
              disabled={true}
              placeholder={user?.nickname}
            />
          </Form.Item>

          <Form.Item
            name="newNickName"
            label="새로운 닉네임"
            rules={[{ required: true, message: "닉네임을 입력해주세요" }]}
          >
            <Input
              style={{ height: 50 }}
              placeholder="새로운 닉네임을 입력해주세요"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                height: 50,
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              변경
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Flex>
  );
};

export default ChangeNickNamePage;
