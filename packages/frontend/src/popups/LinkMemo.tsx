import { Flex } from "antd";
import Label from "../components/Label";
import { useMemoStore } from "../store/memoStore";
import Empty from "../components/Empty";
import { colors } from "../colors";
import { SearchBar, Tag } from "antd-mobile";
import { useState } from "react";
import { MemoData } from "../types";

interface LinkMemoProps {
  selMemo: MemoData;
  setSelMemo: (memo: MemoData) => void;
}
const LinkMemo = (props: LinkMemoProps) => {
  const memos = useMemoStore((state) => state.memos);

  const [search, setSearch] = useState("");
  return (
    <Flex vertical style={{ padding: "0px 20px" }} gap={10}>
      <Flex>
        <SearchBar
          placeholder="검색어를 입력하세요."
          style={{ flex: 8 }}
          onChange={setSearch}
        />
      </Flex>
      {memos.length === 0 && <Empty />}
      {memos
        .filter(
          (memo) =>
            props.selMemo?.id !== memo.id &&
            (memo.content.includes(search) || memo.title.includes(search))
        )
        .map((memo) => (
          <Flex
            key={memo.id}
            onClick={() => {
              props.setSelMemo(memo);
            }}
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor: colors.lightGray,
            }}
            justify="space-between"
            align="center"
          >
            <Flex gap={10} align="center">
              <Label
                name={memo.title}
                style={{ fontSize: 15, fontWeight: "bold" }}
              />
              <Label name={memo.content} style={{ fontSize: 12 }} placeholder />
            </Flex>
            <Tag color="primary">{memo.group}</Tag>
          </Flex>
        ))}
    </Flex>
  );
};

export default LinkMemo;
