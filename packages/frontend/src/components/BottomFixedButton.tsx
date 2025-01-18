import { Button, ButtonProps, Space } from "antd-mobile";

interface BottomFixedButtonProps extends ButtonProps {
  name: string;
}

const BottomFixedButton = (props: BottomFixedButtonProps) => {
  return (
    <Space
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <Button
        block
        color="primary"
        size="large"
        style={{ width: "90vw" }}
        {...props}
      >
        {props.name}
      </Button>
    </Space>
  );
};
export default BottomFixedButton;
