import { EditOutlined } from "@ant-design/icons";
import { Flex, Space } from "antd";
import { FileOutline, RightOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import Label from "./Label";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";
import CustomCard from "./Card";

const MemoCard = () => {
  const navigate = useNavigate();
  const isDarkMode = useThemeStore((state) => state.theme.isDarkMode);
  return (
    <CustomCard
      title={
        <>
          <FileOutline /> 메모 정리
        </>
      }
      extra={<RightOutline onClick={() => navigate("/memo")} />}
      actions={[
        <EditOutlined
          key="edit"
          onClick={() => {
            navigate("memoEdit");
          }}
          style={{
            fontSize: "20px",
            color: isDarkMode ? colors.lightWhite : colors.darkBlack,
          }}
        />,
      ]}
    >
      <Flex vertical gap={5}>
        <Label name="메모 목록" />
        <Space direction="horizontal"></Space>
      </Flex>
    </CustomCard>
  );
};
export default MemoCard;
