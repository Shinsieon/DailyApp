import { Flex } from "antd";
import Label from "./Label";

interface CardItemProps {
  title: string;
  description?: string;
  backgroundColor?: string;
  onClick: (e: any) => void;
}

const CardItem = (props: CardItemProps) => {
  const { title, onClick, backgroundColor, description } = props;
  return (
    <Flex
      vertical
      style={{
        backgroundColor: backgroundColor || "transparent",
        padding: "5px 10px",
        borderRadius: 10,
      }}
      justify="start"
      align="left"
      onClick={onClick}
    >
      <Label
        name={title}
        style={{
          fontSize: 13,
        }}
        bold
      />
      <Label
        name={description}
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          fontSize: 16,
        }}
        placeholder
        maxLength={6}
      />
    </Flex>
  );
};

export default CardItem;
