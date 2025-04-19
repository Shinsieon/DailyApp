// filepath: /Users/sinsieon/ReactNative/myapp/packages/frontend/src/components/CustomCard.tsx
import React from "react";
import { colors } from "../colors";
import { CardProps, Flex } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import Label from "./Label";

interface CustomCardProps extends CardProps {
  children?: React.ReactNode;
  onClick?: () => void;
  onAddClick?: () => void;
  onCardItemClick?: (params: any) => void;
  title?: string;
}

const CustomCard = (props: CustomCardProps) => {
  const { children, onClick, onAddClick, title } = props;
  return (
    <Flex
      vertical
      gap={10}
      style={{
        backgroundColor: colors.lightWhite,
        padding: 10,
        borderRadius: 10,
        flex: 1,
      }}
      onClick={onClick}
    >
      <Flex justify="space-between" align="center">
        <Label name={title} style={{ fontWeight: "bold", fontSize: 20 }} />
        <PlusCircleOutlined
          onClick={(e) => {
            e.stopPropagation();
            if (onAddClick) {
              onAddClick();
            }
          }}
          style={{
            fontSize: 20,
            padding: 5,
            borderRadius: 10,
            color: colors.darkBlack,
          }}
        />
      </Flex>
      <Flex vertical gap={5}>
        {children}
      </Flex>
    </Flex>
  );
};

export default CustomCard;
