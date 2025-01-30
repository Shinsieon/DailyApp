import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";
import { Input, InputProps } from "antd-mobile";
import { ClearOutlined } from "@ant-design/icons";

interface TextFieldProps extends InputProps {
  name?: string;
}

const TextField = (props: TextFieldProps) => {
  const theme = useThemeStore((state) => state.theme);
  const style = {
    color: theme.isDarkMode ? colors.lightWhite : colors.darkBlack,
    border: "solid 1px var(--adm-color-border)",
    borderRadius: 10,
    borderColor: theme.isDarkMode ? colors.lightBlack : colors.lightGray,
    height: 50,
    padding: "0 10px",
    width: "95%",
  };
  return (
    <Input
      {...props}
      style={style}
      name={props.name}
      clearable={true}
      clearIcon={<ClearOutlined />}
      placeholder={props.placeholder}
      type={props.type}
    />
  );
};
export default TextField;
