import { Flex, Space } from "antd";
import { useUserStore } from "../store/userStore";
import Label from "./Label";
import { useNavigate } from "react-router-dom";
import UserAvatar from "./UserAvatar";

const Profile = () => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  return (
    <Space style={{ fontSize: "24px" }}>
      {user ? (
        <Flex
          style={{ alignItems: "flex-end" }}
          gap={5}
          onClick={() => {
            navigate("/myPage");
          }}
        >
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
