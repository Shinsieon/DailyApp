import { EditOutlined } from "@ant-design/icons";
import { Flex, Space } from "antd";
import { FileOutline, RightOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import Label from "./Label";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";
import CustomCard from "./Card";
import { useMemoStore } from "../store/memoStore";
import { Tag } from "antd-mobile";

const MemoCard = () => {
  const navigate = useNavigate();
  const isDarkMode = useThemeStore((state) => state.theme.isDarkMode);
  const memos = useMemoStore((state) => state.memos);
  return (
    <CustomCard
      title={
        <>
          <FileOutline /> 메모 정리
        </>
      }
      extra={<RightOutline onClick={() => navigate("/memo")} />}
      onClick={() => navigate("/memo")}
      actions={[
        <EditOutlined
          key="edit"
          onClick={(e) => {
            e.stopPropagation();
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
        <Space direction="horizontal">
          {memos
            .sort((a, b) => b.id! - a.id!)
            .map(
              (memo, index: number) =>
                index < 3 && (
                  <Space key={memo.id}>
                    <Tag style={{ fontSize: "15px" }} color="primary">
                      {" "}
                      {memo.title}
                    </Tag>
                  </Space>
                )
            )}
        </Space>
      </Flex>
    </CustomCard>
  );
};
export default MemoCard;
