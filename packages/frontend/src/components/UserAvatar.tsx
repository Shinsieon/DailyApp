import { UserOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { colors } from "../colors";

const UserAvatar = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  return (
    <UserOutline
      onClick={() => {
        if (!user) navigate("/loginPage");
        else navigate("/myPage");
      }}
      style={{
        backgroundColor: colors.lightGray,
        padding: 10,
        borderRadius: 10,
        color: user ? colors.primary : colors.darkBlack,
      }}
    />
  );
};
export default UserAvatar;
