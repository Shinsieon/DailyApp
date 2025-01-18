import { useNavigate } from "react-router-dom";
import { NavBar, NavBarProps } from "antd-mobile";

interface AppHeaderProps extends NavBarProps {
  title: string;
}

const AppHeader = (props: AppHeaderProps) => {
  const navigate = useNavigate();
  return (
    <NavBar
      {...props}
      onBack={() => {
        navigate(-1);
      }}
    >
      {props.title}
    </NavBar>
  );
};
export default AppHeader;
