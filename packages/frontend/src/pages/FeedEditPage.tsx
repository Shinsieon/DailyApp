import { Flex } from "antd";
import AppHeader from "../components/AppHeader";
import Label from "../components/Label";
import { Button, Cascader, TextArea } from "antd-mobile";
import { useUserStore } from "../store/userStore";
import { colors } from "../colors";
import { useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import UserAvatar from "../components/UserAvatar";
const categoryOption = [
  { label: "음악", value: "음악" },
  { label: "책", value: "책" },
  { label: "영화", value: "영화" },
  { label: "여행", value: "여행" },
  { label: "기타", value: "기타" },
];
const FeedEditPage = () => {
  const { user } = useUserStore();
  const [category, setCategory] = useState("주제 추가");
  const [categoryShow, setCategoryShow] = useState(false);
  const [content, setContent] = useState("");
  return (
    <Flex vertical style={{ height: "100vh" }}>
      {/* 100vh 지우지말것 */}
      <AppHeader
        title="피드 수정"
        right={
          <Button fill="none" color="primary">
            저장
          </Button>
        }
      />
      <Flex vertical style={{ flex: 1, overflowY: "auto" }}>
        <Flex
          gap={10}
          style={{
            borderTop: `1px solid ${colors.lightGray}`,
            padding: "10px",
          }}
        >
          <Flex style={{ flex: 1 }}>
            <UserAvatar />
          </Flex>
          <Flex vertical style={{ flex: 8 }}>
            <Flex vertical>
              <Flex gap={10} align="center">
                <Label name={user!.nickname} style={{ fontWeight: "bold" }} />
                <FaAngleRight />
                <Label
                  name={category}
                  placeholder
                  onClick={() => setCategoryShow(true)}
                />
              </Flex>
              <TextArea
                placeholder="나의 하루 중 어떤 이야기를 나누고 싶으신가요?"
                autoSize
                value={content}
                onChange={(value) => {
                  setContent(value);
                }}
              />
              <Cascader
                options={categoryOption}
                placeholder={categoryOption[0].label}
                visible={categoryShow}
                cancelText="취소"
                onCancel={() => setCategoryShow(false)}
                confirmText="확인"
                onConfirm={(value) => {
                  setCategory(value[0] as string);
                  setCategoryShow(false);
                }}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default FeedEditPage;
