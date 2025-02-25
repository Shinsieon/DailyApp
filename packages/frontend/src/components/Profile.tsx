import { Flex, Space } from "antd";
import { useUserStore } from "../store/userStore";
import Label from "./Label";
import { UserOutline } from "antd-mobile-icons";
import { colors } from "../colors";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useUserStore((state) => state.user);

  return (
    <Space style={{ fontSize: "24px" }}>
      {user ? (
        <Flex style={{ alignItems: "flex-end" }} gap={5}>
          <Label name={user.nickname + "님 반갑습니다"}></Label>
          <UserAvatar />
        </Flex>
      ) : (
        <UserAvatar />
      )}
    </Space>
  );
};
function UserAvatar() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  return (
    <UserOutline
      onClick={() => {
        if (!user) navigate("/login");
      }}
      style={{
        backgroundColor: colors.lightGray,
        padding: 5,
        borderRadius: 10,
        color: user ? colors.primary : colors.darkBlack,
      }}
    />
  );
}

export default Profile;
