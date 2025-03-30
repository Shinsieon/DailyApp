import { useLocation, useNavigate } from "react-router-dom";
import { NavBar, NavBarProps } from "antd-mobile";
import { useMenuStore } from "../store/menuStore";

interface AppHeaderProps extends NavBarProps {
  title: string;
}

const AppHeader = (props: AppHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(`location.pathname: ${location.pathname}`);
  const cangoBack = location.pathname !== "/";
  return (
    <NavBar
      {...props}
      onBack={() => {
        navigate(-1);
      }}
      backIcon={cangoBack}
    >
      {props.title}
    </NavBar>
  );
};
export default AppHeader;
