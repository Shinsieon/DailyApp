import { Typography } from "antd";
import { TextProps } from "antd/es/typography/Text";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";

interface LabelProps extends TextProps {
  name?: string | number;
  placeholder?: boolean;
  bold?: boolean;
  maxLength?: number;
}
const Label = (props: LabelProps) => {
  const theme = useThemeStore((state) => state.theme);
  const style = {
    color: props.placeholder
      ? colors.darkGray
      : theme.isDarkMode
        ? colors.lightWhite
        : colors.darkBlack,
    fontWeight: props.bold ? "bold" : "normal",
  };
  let showLabelText = "";
  if (props.name) {
    showLabelText = props.name.toString();
  }
  if (props.maxLength && showLabelText.length > props.maxLength) {
    showLabelText = showLabelText.slice(0, props.maxLength) + "...";
  }

  return (
    <Typography.Text {...props} style={{ ...style, ...props.style }}>
      {showLabelText}
    </Typography.Text>
  );
};
export default Label;
