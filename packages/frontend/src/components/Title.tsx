import { Typography } from "antd";
import { TitleProps } from "antd/es/typography/Title";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";

interface TitleProps_ extends TitleProps {
  name: string;
}

const Title = (props: TitleProps_) => {
  const theme = useThemeStore((state) => state.theme);
  return (
    <Typography.Title
      style={{
        color: theme.isDarkMode ? colors.lightWhite : colors.darkBlack,
      }}
      {...props}
    >
      {props.name}
    </Typography.Title>
  );
};
export default Title;
