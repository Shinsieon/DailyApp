import { Button, Flex, message } from "antd";
import { Input } from "antd-mobile";
import AppHeader from "../components/AppHeader";
import { useUserStore } from "../store/userStore";
import { api, showError } from "../api";
import Label from "../components/Label";
import sizes from "../sizes";
import { colors } from "../colors";
import { useState } from "react";
import BottomFixedButton from "../components/BottomFixedButton";

const ChangeNickNamePage = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [newNickName, setNewNickName] = useState("");
  const handleChangeNickName = async () => {
    if (!newNickName) {
      message.error("닉네임을 입력해주세요.");
      return;
    }
    try {
      const newUser = await api.updateNickname(newNickName);
      message.success("닉네임이 변경되었습니다.");
      setUser(newUser);
      setNewNickName("");
    } catch (e) {
      showError(e);
    }
  };
  return (
    <Flex vertical>
      {/* 100vh 지우지말것 */}
      <AppHeader title="닉네임 변경" />
      <Flex
        vertical
        style={{ flex: 1, overflowY: "auto", padding: "20px", gap: 20 }}
      >
        <Flex vertical gap={5}>
          <Label
            name="이전 닉네임"
            style={{
              fontSize: sizes.font.medium,
              fontWeight: "bold",
            }}
          />
          <Flex>
            <Input
              value={user?.nickname}
              style={{
                backgroundColor: colors.lightGray,
                padding: 10,
                borderRadius: 10,
              }}
              disabled={true}
            />
          </Flex>
        </Flex>
        <Flex vertical gap={5}>
          <Label
            name="새로운 닉네임"
            style={{
              fontSize: sizes.font.medium,
              fontWeight: "bold",
            }}
          />
          <Flex>
            <Input
              value={newNickName}
              onChange={(value) => {
                setNewNickName(value);
              }}
              style={{
                backgroundColor: colors.lightGray,
                padding: 10,
                borderRadius: 10,
              }}
              placeholder="새로운 닉네임을 입력해주세요"
            />
          </Flex>
        </Flex>

        <Flex>
          <BottomFixedButton
            type="single"
            confirmName="저장"
            onConfirm={handleChangeNickName}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ChangeNickNamePage;
