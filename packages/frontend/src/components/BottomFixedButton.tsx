import { Flex } from "antd";
import { Button } from "antd-mobile";

interface BottomFixedButtonProps {
  type: "single" | "double";
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmName?: string;
  cancelName?: string;
  confirmColor?: string;
  cancelColor?: string;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
}

const BottomFixedButton = (props: BottomFixedButtonProps) => {
  return (
    <Flex
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        padding: "20px",
      }}
      color="primary"
    >
      {props.type === "single" ? (
        <Button
          style={{ width: "100%" }}
          onClick={props.onConfirm}
          disabled={props.confirmDisabled}
          block
          color="primary"
          size="large"
        >
          {props.name}
        </Button>
      ) : (
        <Flex style={{ width: "100%" }} gap={10}>
          <Flex style={{ flex: 1 }}>
            <Button
              block
              color="primary"
              size="large"
              onClick={props.onConfirm}
              disabled={props.confirmDisabled}
            >
              {props.confirmName}
            </Button>
          </Flex>
          <Flex style={{ flex: 1 }}>
            <Button
              block
              color="default"
              size="large"
              onClick={props.onCancel}
              disabled={props.cancelDisabled}
            >
              {props.cancelName}
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};
export default BottomFixedButton;
