import { Flex, Input, Switch } from "antd";
import AppHeader from "../components/AppHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemoStore } from "../store/memoStore";
import sizes from "../sizes";
import Label from "../components/Label";
import Empty from "../components/Empty";
import { colors } from "../colors";
import { Button, FloatingBubble, Space, Tag, TextArea } from "antd-mobile";
import { MemoData } from "../types";
import { useEffect, useState } from "react";
import { EditFill } from "antd-mobile-icons";
import { FolderOutlined } from "@ant-design/icons";

const MemoDetailPage = () => {
  const location = useLocation();
  const memoId = location.state.memoId;
  const { memos, updateMemo } = useMemoStore();
  const memo = memos.find((m) => m.id === memoId);
  console.log(`memoId: ${memoId}`);
  const navigate = useNavigate();
  const [relatedMemos, setRelatedMemos] = useState<MemoData[]>([]);
  useEffect(() => {
    if (memo) {
      console.log(`memo.relatedMemoIds: ${memo.relatedMemoIds}`);
      const relatedMemoIds = memo.relatedMemoIds;
      const relatedMemos = memos.filter((m) => relatedMemoIds?.includes(m.id!));
      setRelatedMemos(relatedMemos);
    }
  }, [memo]);
  useEffect(() => {
    if (memo) updateMemo({ ...memo, showCount: (memo.showCount || 0) + 1 });
  }, []);
  if (!memo) return <Empty />;
  return (
    <Flex vertical style={{ height: "100vh" }}>
      <AppHeader title={`메모 `} />
      <Flex
        vertical
        style={{ flex: 1, overflowY: "auto", padding: "20px" }}
        gap={15}
      >
        <Flex vertical gap={5}>
          <Label
            name="제목"
            style={{
              fontSize: sizes.font.medium,
              fontWeight: "bold",
            }}
          />
          <Flex>
            <Input
              value={memo.title}
              disabled
              style={{
                backgroundColor: colors.lightGray,
                padding: 10,
                borderRadius: 10,
              }}
            />
          </Flex>
        </Flex>
        <Flex vertical gap={5}>
          <Label
            name="내용"
            style={{
              fontSize: sizes.font.medium,
              fontWeight: "bold",
            }}
          />
          <Flex>
            <TextArea
              value={memo.content}
              autoSize={{ minRows: 5 }}
              style={{
                flex: 1,
                backgroundColor: colors.lightGray,
                padding: 10,
                borderRadius: 10,
              }}
              disabled
              showCount
            />
          </Flex>
        </Flex>
        <Flex vertical gap={5}>
          <Flex justify="space-between" align="center">
            <Label
              name="연결된 메모"
              style={{
                fontSize: sizes.font.medium,
                fontWeight: "bold",
              }}
            />
          </Flex>
          <Flex gap={10}>
            {relatedMemos.map((rMemo) => (
              <Button
                shape="rounded"
                style={{ backgroundColor: colors.lightGray, border: "none" }}
                onClick={() => {
                  navigate("/memoDetail", { state: { memoId: rMemo.id } });
                }}
              >
                <Space>
                  <FolderOutlined />
                  <span>{rMemo.title}</span>
                  <Label
                    name={
                      rMemo.content.length > 10
                        ? rMemo.content.substring(0, 10) + "..."
                        : rMemo.content
                    }
                    placeholder
                  />
                </Space>
              </Button>
            ))}
          </Flex>
        </Flex>

        <Flex
          justify="space-between"
          align="center"
          style={{
            backgroundColor: colors.lightGray,
            padding: 10,
            borderRadius: 10,
            marginBottom: 30,
          }}
        >
          <Label
            name="그룹"
            style={{
              fontSize: sizes.font.medium,
              fontWeight: "bold",
            }}
          />
          <Tag color="primary" fill="outline">
            {memo.group}
          </Tag>
        </Flex>
      </Flex>
      <FloatingBubble
        style={{
          "--initial-position-bottom": "24px",
          "--initial-position-right": "24px",
          "--edge-distance": "24px",
        }}
        onClick={() => navigate("/memoEdit", { state: { memoId: memoId } })}
      >
        <EditFill fontSize={32} />
      </FloatingBubble>
    </Flex>
  );
};

export default MemoDetailPage;
