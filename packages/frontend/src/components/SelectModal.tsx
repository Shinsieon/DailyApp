import { Button, Divider, Modal } from "antd-mobile";
import { Flex } from "antd";
import Label from "./Label";

export interface SelectModalOptions {
  title: string;
  question: string;
  leftButtonText: string;
  rightButtonText: string;
  onLeftButtonClick: () => void;
  onRightButtonClick: () => void;
}

/**
 * 유틸 함수로 호출 가능한 커스텀 모달
 */
export function selectModal(options: SelectModalOptions) {
  const handler = Modal.show({
    content: (
      <Flex vertical>
        <Label name={options.title} bold style={{ fontSize: 20 }} />
        <Divider />
        <Label name={options.question} placeholder />
        <Flex style={{ marginTop: 24, gap: 12, width: "100%" }}>
          <Button
            color="default"
            shape="rounded"
            fill="solid"
            block
            onClick={() => {
              options.onLeftButtonClick();
              handler.close(); // 모달 닫기
            }}
          >
            {options.leftButtonText}
          </Button>
          <Button
            block
            color="primary"
            shape="rounded"
            fill="solid"
            onClick={() => {
              options.onRightButtonClick();
              handler.close(); // 모달 닫기
            }}
          >
            {options.rightButtonText}
          </Button>
        </Flex>
      </Flex>
    ),
    closeOnMaskClick: true,
    onClose: () => {
      // 필요시 마스크 클릭 시 로직 추가
      console.log("모달 닫힘 (마스크 클릭 포함)");
    },
  });
}
