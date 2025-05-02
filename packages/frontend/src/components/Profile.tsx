import { Flex, Space } from "antd";
import { useUserStore } from "../store/userStore";
import Label from "./Label";
import UserAvatar from "./UserAvatar";

const Profile = () => {
  const user = useUserStore((state) => state.user);
  return (
    <Space style={{ fontSize: "24px" }}>
      {user ? (
        <Flex style={{ alignItems: "center" }} gap={5}>
          <Label name={user.nickname + "님 반갑습니다"}></Label>
          <UserAvatar />
        </Flex>
      ) : (
        <UserAvatar />
      )}
    </Space>
  );
};

export default Profile;
