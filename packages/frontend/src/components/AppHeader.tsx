import { useLocation, useNavigate } from "react-router-dom";
import { NavBar, NavBarProps } from "antd-mobile";

interface AppHeaderProps extends NavBarProps {
  title: string;
  right?: React.ReactNode;
  backIcon?: boolean;
}

const AppHeader = (props: AppHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cangoBack = location.pathname !== "/";
  return (
    <NavBar
      right={props.right}
      {...props}
      onBack={() => {
        navigate(-1);
      }}
      backIcon={cangoBack ? props.backIcon : false}
    >
      {props.title}
    </NavBar>
  );
};
export default AppHeader;
