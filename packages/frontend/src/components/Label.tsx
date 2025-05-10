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
  const {
    name,
    placeholder,
    bold,
    maxLength,
    style: customStyle,
    ...restProps // ✅ 나머지만 Typography.Text로 전달
  } = props;

  const theme = useThemeStore((state) => state.theme);

  const style = {
    color: placeholder
      ? colors.darkGray
      : theme.isDarkMode
        ? colors.lightWhite
        : colors.darkBlack,
    fontWeight: bold ? "bold" : "normal",
    ...customStyle, // ✅ 사용자 스타일과 병합
  };

  let showLabelText = name?.toString() || "";
  if (maxLength && showLabelText.length > maxLength) {
    showLabelText = showLabelText.slice(0, maxLength) + "...";
  }

  return (
    <Typography.Text {...restProps} style={style}>
      {showLabelText}
    </Typography.Text>
  );
};
export default Label;
