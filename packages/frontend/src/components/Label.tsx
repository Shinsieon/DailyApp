import { Typography } from "antd";
import { TextProps } from "antd/es/typography/Text";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";

interface LabelProps extends TextProps {
  name?: string | number;
  placeholder?: boolean;
}
const Label = (props: LabelProps) => {
  const theme = useThemeStore((state) => state.theme);
  return (
    <Typography.Text
      style={{
        color: props.placeholder
          ? colors.darkGray
          : theme.isDarkMode
            ? colors.lightWhite
            : colors.darkBlack,
      }}
      {...props}
    >
      {props.name}
    </Typography.Text>
  );
};
export default Label;
