import { PlusCircleOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { RightOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import Label from "./Label";
import { colors } from "../colors";
import { useMemoStore } from "../store/memoStore";
import { MemoData } from "../types";

const MemoCard = () => {
  const navigate = useNavigate();
  const memos = useMemoStore((state) => state.memos);
  return (
    <Flex vertical style={{ backgroundColor: colors.lighterGray, padding: 10 }}>
      <Flex justify="space-between" style={{ marginBottom: 10 }}>
        <Label
          name="Memo"
          style={{ fontWeight: "bold", fontSize: 20 }}
          onClick={() => {
            navigate("memo");
          }}
        />
        <Flex style={{ alignItems: "center" }}>
          <RightOutline
            onClick={() => {
              navigate("memo");
            }}
            style={{
              fontSize: 15,
              padding: 5,
              borderRadius: 10,
              color: colors.lightWhite,
              backgroundColor: colors.darkGray,
            }}
          />
          <PlusCircleOutlined
            onClick={() => {
              navigate("memoEdit");
            }}
            style={{
              fontSize: 20,
              padding: 5,
              borderRadius: 10,
              color: colors.darkBlack,
            }}
          />
        </Flex>
      </Flex>
      <Flex vertical gap={5}>
        {memos
          .sort((a, b) => b.id! - a.id!)
          .map(
            (memo, index: number) =>
              index < 3 && <MemoItem key={memo.id} {...memo} />
          )}
      </Flex>
    </Flex>
  );
};

function MemoItem(memo: MemoData) {
  const navigate = useNavigate();
  return (
    <Flex
      style={{
        backgroundColor: colors.lightGreen,
        padding: 10,
        borderRadius: 10,
      }}
      justify="space-between"
      align="center"
      onClick={() => {
        navigate("/memoEdit", { state: { memoId: memo.id } });
      }}
    >
      <Label
        name={memo.title}
        style={{
          fontWeight: "bold",
          fontSize: 18,
          maxWidth: 150, // 제목이 너무 길어지지 않도록 최대 너비 설정
          overflow: "hidden",
          whiteSpace: "nowrap", // 한 줄로 유지
          textOverflow: "ellipsis", // 길면 "..." 표시
        }}
      />
      <Label
        name={memo.content}
        style={{
          fontSize: 16,
          maxWidth: 200, // 최대 너비 설정 (조절 가능)
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      />
    </Flex>
  );
}
export default MemoCard;
