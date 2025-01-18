// filepath: /Users/sinsieon/ReactNative/myapp/packages/frontend/src/components/CustomCard.tsx
import React from "react";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";
import { Card, CardProps } from "antd";

interface CustomCardProps extends CardProps {
  children?: React.ReactNode;
  actions?: React.ReactNode[];
}

const CustomCard: React.FC<CustomCardProps> = ({
  children,
  actions,
  ...props
}) => {
  const isDarkMode = useThemeStore((state) => state.theme.isDarkMode);

  return (
    <Card
      {...props}
      style={{
        backgroundColor: isDarkMode ? colors.lightBlack : colors.lightWhite,
        borderColor: isDarkMode ? colors.lightBlack : colors.lightGray,
      }}
      actions={actions}
      styles={{
        extra: { color: isDarkMode ? colors.lightWhite : colors.darkBlack },
        header: {
          color: isDarkMode ? colors.lightWhite : colors.darkBlack,
        },
        body: {
          color: isDarkMode ? colors.lightWhite : colors.darkBlack,
        },
        actions: {
          backgroundColor: isDarkMode ? colors.lightBlack : colors.lightWhite,
          color: isDarkMode ? colors.lightWhite : colors.darkBlack,
        },
      }}
    >
      {children}
    </Card>
  );
};

export default CustomCard;
