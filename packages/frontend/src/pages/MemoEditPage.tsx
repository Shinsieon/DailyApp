import { Flex, message } from "antd";
import AppHeader from "../components/AppHeader";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Cascader,
  Input,
  Space,
  Switch,
  Tag,
  TextArea,
} from "antd-mobile";
import { MemoData } from "../types";
import { useMemoStore } from "../store/memoStore";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Label from "../components/Label";
import { colors } from "../colors";
import CustomPopup from "../components/CustomPopup";
import LinkMemo from "../popups/LinkMemo";
import sizes from "../sizes";
import { CheckListValue } from "antd-mobile/es/components/check-list";
import { AddCircleOutline } from "antd-mobile-icons";
import { FolderOutlined } from "@ant-design/icons";
import BottomFixedButton from "../components/BottomFixedButton";

const MemoEditPage = () => {
  const [groupVisible, setGroupVisible] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [mentionVisible, setMentionVisible] = useState(false);
  const { memos, saveMemo, updateMemo, deleteMemo } = useMemoStore();
  const groups =
    memos.length > 0 ? [...new Set(memos.map((memo) => memo.group))] : ["기본"];

  const memoId = location.state?.memoId;
  const prevMemo = memos.find((memo) => memo.id === memoId);

  const [updatedMemo, setUpdatedMemo] = useState<MemoData>(
    prevMemo ||
      ({
        title: "",
        content: "",
        secret: false,
        group: "기본",
        favorite: false,
        showCount: 0,
        date: dayjs().format("YYYYMMDD"),
        relatedMemoIds: [],
      } as MemoData)
  );
  const [relatedMemos, setRelatedMemos] = useState<MemoData[]>([]);
  useEffect(() => {
    if (prevMemo) {
      const relatedMemoIds = prevMemo.relatedMemoIds;
      const relatedMemos = memos.filter((m) => relatedMemoIds?.includes(m.id!));
      setRelatedMemos(relatedMemos);
    }
  }, [prevMemo]);

  const onfinish = async () => {
    if (updatedMemo.title === "") {
      message.error("제목을 입력해주세요.");
      return;
    }
    if (updatedMemo.content === "") {
      message.error("내용을 입력해주세요.");
      return;
    }
    if (isNewGroup && updatedMemo.group === "") {
      message.error("그룹을 선택해주세요.");
      return;
    }
    try {
      const uMemo = {
        ...updatedMemo,
        relatedMemoIds: relatedMemos.map((m) => m.id!),
      };
      if (prevMemo) {
        await updateMemo(uMemo);
      } else {
        await saveMemo(uMemo);
      }
    } catch (e) {
      console.log(`e : ${e}`);
      message.error("메모 저장에 실패했습니다.");
      console.error(e);
      return;
    }
    message.success("메모가 저장되었습니다.");
    navigate(-1);
  };

  return (
    <Flex vertical style={{ height: "100vh" }}>
      <AppHeader title={`메모 ${prevMemo ? "수정" : "추가"}`} />
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
              value={updatedMemo.title}
              style={{
                backgroundColor: colors.lightGray,
                padding: 10,
                borderRadius: 10,
              }}
              onChange={(e) => {
                setUpdatedMemo((prev) => ({ ...prev, title: e }));
              }}
              placeholder="제목을 입력해주세요."
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
              value={updatedMemo.content}
              autoSize={{ minRows: 5 }}
              style={{
                flex: 1,
                backgroundColor: colors.lightGray,
                padding: 10,
                borderRadius: 10,
              }}
              onChange={(e) => {
                setUpdatedMemo((prev) => ({ ...prev, content: e }));
              }}
              placeholder="내용을 입력해주세요."
              showCount
            />
          </Flex>
        </Flex>
        <Flex vertical gap={5}>
          <Flex justify="space-between" align="center">
            <Label
              name="메모 연결"
              style={{
                fontSize: sizes.font.medium,
                fontWeight: "bold",
              }}
            />

            <AddCircleOutline
              style={{ fontSize: 20 }}
              onClick={() => {
                setMentionVisible(true);
              }}
            />
          </Flex>
          <Flex gap={10}>
            {relatedMemos.map((memo) => (
              <Button
                shape="rounded"
                style={{ backgroundColor: colors.lightGray, border: "none" }}
                onClick={() => {
                  setRelatedMemos((prev) =>
                    prev.filter((m) => m.id !== memo.id)
                  );
                }}
              >
                <Space>
                  <FolderOutlined />
                  <span>{memo.title}</span>
                  <Label
                    name={
                      memo.content.length > 10
                        ? memo.content.substring(0, 10) + "..."
                        : memo.content
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
          }}
        >
          <Label
            name="새로운 그룹 생성"
            style={{ fontSize: sizes.font.medium, fontWeight: "bold" }}
          />
          <Switch
            onChange={(isChecked) => {
              setIsNewGroup(isChecked);
              if (!isChecked) {
                setUpdatedMemo((prev) => ({ ...prev, group: "기본" }));
              }
            }}
          />
        </Flex>
        {isNewGroup ? (
          <Flex vertical gap={5} style={{ marginBottom: 30 }}>
            <Label
              name="그룹이름"
              style={{
                fontSize: sizes.font.medium,
                fontWeight: "bold",
              }}
            />
            <Flex>
              <Input
                onChange={(e) => {
                  setUpdatedMemo((prev) => ({ ...prev, group: e }));
                }}
                style={{
                  backgroundColor: colors.lightGray,
                  padding: 10,
                  borderRadius: 10,
                }}
                placeholder="그룹명을 입력해주세요."
              />
            </Flex>
          </Flex>
        ) : (
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
            <Tag
              color="primary"
              fill="outline"
              onClick={() => setGroupVisible(true)}
            >
              {updatedMemo.group}
            </Tag>

            <Cascader
              options={groups.map((group) => ({
                label: group,
                value: group,
              }))}
              visible={groupVisible}
              confirmText="확인"
              cancelText="취소"
              placeholder="그룹선택"
              onConfirm={(value: CheckListValue[]) => {
                setGroupVisible(false);
                const g = groups.find((item) => item === value[0]);
                if (g) setUpdatedMemo((prev) => ({ ...prev, group: g || "" }));
              }}
              onCancel={() => setGroupVisible(false)}
              value={[updatedMemo.group]}
              defaultValue={[updatedMemo.group]}
            />
          </Flex>
        )}
        {/* <Flex style={{ width: "100%" }} gap={10}>
          <Button
            onClick={() => {
              navigate(-1);
            }}
            style={{
              height: "50px",
              flex: 1,
            }}
          >
            취소
          </Button>
          <Button
            onClick={onfinish}
            color="primary"
            style={{ height: "50px", flex: 1 }}
          >
            저장
          </Button>
        </Flex> */}
        <BottomFixedButton
          type="double"
          confirmName="저장"
          onConfirm={onfinish}
          onCancel={() => {
            if (prevMemo) {
              deleteMemo(prevMemo.id!);
              message.success("메모가 삭제되었습니다.");
              navigate(-1);
            } else {
              navigate(-1);
            }
          }}
          cancelName={prevMemo ? "삭제" : "취소"}
        />
      </Flex>

      <CustomPopup
        visible={mentionVisible}
        setVisible={setMentionVisible}
        title="메모 연결"
        height="40vh"
        children={
          <LinkMemo
            selMemo={prevMemo || updatedMemo}
            setSelMemo={(memo) => {
              if (relatedMemos.find((m) => m.id === memo.id)) {
                message.error("이미 연결된 메모입니다.");
                return;
              }
              setMentionVisible(false);
              setRelatedMemos((prev) => [...prev, memo]);
            }}
          />
        }
      />
    </Flex>
  );
};
export default MemoEditPage;
