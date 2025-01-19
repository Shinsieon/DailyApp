import { Empty, Flex, message } from "antd";
import AppHeader from "../components/AppHeader";
import {
  Button,
  Card,
  FloatingBubble,
  Modal,
  SearchBar,
  Space,
  Tabs,
} from "antd-mobile";
import { EditFill, RightOutline } from "antd-mobile-icons";
import {
  CopyFilled,
  DeleteFilled,
  SortDescendingOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { MemoData } from "../types";
import { useMemoStore } from "../store/memoStore";
import { useState } from "react";
import dayjs from "dayjs";
import Label from "../components/Label";

const DEFAULT_GROUP = "전체";

interface MemoItemProps {
  memo: MemoData;
  onHeaderClick: () => void;
  onDeleteClick: () => void;
  onStarClick: () => void;
  onCopyClick: () => void;
}

const MemoItem = (props: MemoItemProps) => (
  <Card
    icon={
      <Button
        style={{ border: "none", width: "30px" }}
        onClick={(e) => {
          e.stopPropagation();
          props.onStarClick();
        }}
      >
        {props.memo.favorite ? (
          <StarFilled style={{ color: "gold" }} />
        ) : (
          <StarOutlined style={{ color: "gold" }}></StarOutlined>
        )}
      </Button>
    }
    onHeaderClick={props.onHeaderClick}
    title={props.memo.title}
    extra={<RightOutline style={{ width: "30px" }} />}
    style={{ borderRadius: "16px", border: "1px solid #e5e5e5" }}
  >
    <Flex vertical gap={5}>
      <Space
        style={{
          maxHeight: "10vh",
          minHeight: "5vh",
          overflow: "hidden",
        }}
      >
        <Label name={props.memo.content} />
      </Space>
      <Space
        style={{
          paddingTop: "5px",
          borderTop: "1px solid #e5e5e5",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Label name={dayjs(props.memo.date).format("YYYY년 MM월 DD일")} />

        <Button style={{ border: "none" }} onClick={() => props.onCopyClick()}>
          <CopyFilled style={{ fontSize: "15px" }} />
        </Button>

        <Button onClick={props.onDeleteClick} style={{ border: "none" }}>
          <DeleteFilled style={{ fontSize: "15px" }} />
        </Button>
      </Space>
    </Flex>
  </Card>
);

const MemoList = ({ memos }: { memos: MemoData[] }) => {
  console.log(`MemoList : ${JSON.stringify(memos.map((m) => m.favorite))}`);
  const navigate = useNavigate();
  const deleteMemo = useMemoStore((state) => state.deleteMemo);
  const toggleMemo = useMemoStore((state) => state.toggleMemo);
  const handleDeleteClick = (memoId: number) => {
    Modal.confirm({
      content: "정말 삭제하시겠습니까?",
      confirmText: "확인",
      onConfirm: async () => {
        await deleteMemo(memoId);
        message.success("삭제되었습니다.");
      },
      cancelText: "취소",
    });
  };
  const handleHeaderClick = (memoId: number) => {
    navigate("/memoEdit", { state: { memoId: memoId } });
  };
  const handleStarClick = (memoId: number) => {
    console.log(memoId);
    toggleMemo(memoId);
  };
  const handleCopyClick = async (content: string) => {
    console.log("copy click");
    if (window && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "copy", data: content })
      );
    }
    await navigator.clipboard.writeText(content);

    message.success(`${await navigator.clipboard.readText()} 복사되었습니다.`);
  };
  return (
    <Flex vertical gap={10} style={{ height: "75vh", overflowY: "auto" }}>
      {memos.length > 0 ? (
        memos.map((memo) => (
          <MemoItem
            key={memo.id}
            memo={memo}
            onHeaderClick={() => handleHeaderClick(memo.id!)}
            onDeleteClick={() => handleDeleteClick(memo.id!)}
            onStarClick={() => handleStarClick(memo.id!)}
            onCopyClick={() => handleCopyClick(memo.content)}
          />
        ))
      ) : (
        <Empty description="메모가 없습니다." />
      )}
    </Flex>
  );
};

interface SearchBarProps {
  showFavorite: boolean;
  setSearch: (value: string) => void;
  setShowFavorite: (value: boolean) => void;
  sortDesc: boolean;
  setSortDesc: (value: boolean) => void;
}

const SearchBarCustom = (props: SearchBarProps) => {
  const { showFavorite, setSearch, setShowFavorite, sortDesc, setSortDesc } =
    props;
  return (
    <Flex gap={10} style={{ marginBottom: "10px" }}>
      <SearchBar
        placeholder="검색어를 입력하세요."
        style={{ flex: 8 }}
        onChange={setSearch}
      />
      <Button
        style={{ padding: "0px", flex: 1 }}
        onClick={() => setShowFavorite(!showFavorite)}
      >
        {showFavorite ? (
          <StarFilled style={{ color: "gold" }} />
        ) : (
          <StarOutlined style={{ color: "gold" }} />
        )}
      </Button>
      <Button
        style={{ padding: "0px", flex: 1 }}
        onClick={() => setSortDesc(!sortDesc)}
      >
        {sortDesc ? (
          <SortDescendingOutlined />
        ) : (
          <SortDescendingOutlined rotate={180} />
        )}
      </Button>
    </Flex>
  );
};

const MemoPage = () => {
  const navigate = useNavigate();

  const memos = useMemoStore((state) => state.memos);
  const groups = [...new Set(memos.map((memo) => memo.group))];
  const [selGroup, setSelGroup] = useState(DEFAULT_GROUP);
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [showFavorite, setShowFavorite] = useState(false);

  return (
    <Flex vertical style={{ width: "100%" }}>
      <AppHeader title="메모 정리" />
      <Space direction="vertical">
        <Tabs
          defaultActiveKey={selGroup}
          style={{ width: "100vw" }}
          onChange={(key) => setSelGroup(key)}
        >
          <Tabs.Tab title={DEFAULT_GROUP} key={DEFAULT_GROUP}>
            <SearchBarCustom
              showFavorite={showFavorite}
              setSearch={setSearch}
              setShowFavorite={setShowFavorite}
              sortDesc={sortDesc}
              setSortDesc={setSortDesc}
            />
            <MemoList
              memos={memos
                .filter(
                  (memo) =>
                    memo.favorite === showFavorite &&
                    (memo.title.includes(search) ||
                      memo.content.includes(search))
                )
                .sort((a, b) => (sortDesc ? b.id! - a.id! : a.id! - b.id!))}
            />
          </Tabs.Tab>

          {groups.map((group) => (
            <Tabs.Tab title={group} key={group}>
              <SearchBarCustom
                showFavorite={showFavorite}
                setSearch={setSearch}
                setShowFavorite={setShowFavorite}
                sortDesc={sortDesc}
                setSortDesc={setSortDesc}
              />
              <MemoList
                memos={memos
                  .filter(
                    (memo) =>
                      memo.group === group &&
                      memo.favorite === showFavorite &&
                      (memo.title.includes(search) ||
                        memo.content.includes(search))
                  )
                  .sort((a, b) =>
                    sortDesc
                      ? b.date.localeCompare(a.date)
                      : a.date.localeCompare(b.date)
                  )}
              />
            </Tabs.Tab>
          ))}
        </Tabs>
        <FloatingBubble
          style={{
            "--initial-position-bottom": "24px",
            "--initial-position-right": "24px",
            "--edge-distance": "24px",
          }}
          onClick={() => navigate("/memoEdit")}
        >
          <EditFill fontSize={32} />
        </FloatingBubble>
      </Space>
    </Flex>
  );
};

export default MemoPage;
