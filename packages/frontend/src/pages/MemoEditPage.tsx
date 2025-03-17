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

const MemoEditPage = () => {
  const [groupVisible, setGroupVisible] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [mentionVisible, setMentionVisible] = useState(false);
  const { memos, saveMemo, updateMemo } = useMemoStore();
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
        <Flex>
          <Button
            onClick={onfinish}
            color="primary"
            style={{ width: "100%", height: "50px" }}
          >
            저장
          </Button>
        </Flex>
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

{
  /* <Form
          form={form}
          footer={
            <Button
              type="submit"
              color={"primary"}
              block
              style={{ marginTop: "20px" }}
            >
              저장
            </Button>
          }
          onFinish={onfinish}
        >
          <Form.Header>메모 편집</Form.Header>
          <Form.Item
            name="title"
            label="제목"
            rules={[{ required: true, message: "제목을 입력해주세요." }]}
            initialValue={prevMemo?.title}

            //--prefix-width
          >
            <Input placeholder="제목을 입력해주세요." />
          </Form.Item>
          <Form.Item
            name="content"
            label="내용"
            rules={[{ required: true, message: "내용을 입력해주세요." }]}
            initialValue={prevMemo?.content}
          >
            <TextArea placeholder="내용을 입력해주세요." rows={10} showCount />
          </Form.Item>
          <Flex style={{ padding: "0px 20px" }} justify="space-between">
            <Label name="연결 메모" />
            <Flex>
              {relatedMemos.length === 0 && (
                <Label
                  name="연결된 메모가 없습니다. @를 입력해서 추가해보세요"
                  placeholder
                />
              )}
              {relatedMemos.map((memo) => (
                <Label
                  key={memo.id}
                  name={memo.title}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 10,
                    backgroundColor: colors.lightGray,
                    margin: "0 5px",
                  }}
                />
              ))}
            </Flex>
          </Flex>
          <Form.Item name="isNewGroup" valuePropName="checked">
            <Flex justify="space-between">
              <Label name="새로운 그룹" />
              <Switch
                onChange={(isChecked) => {
                  setIsNewGroup(isChecked);
                  if (!isChecked) setSelGroup("기본");
                }}
              />
            </Flex>
          </Form.Item>
          {isNewGroup ? (
            <Form.Item name="newGroup" label="그룹이름">
              <Input
                onChange={setNewGroup}
                placeholder="그룹명을 입력해주세요."
              />
            </Form.Item>
          ) : (
            <Form.Item label="그룹" onClick={() => setGroupVisible(true)}>
              <Label name={selGroup} />
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
                  if (g) setSelGroup(g);
                }}
                onCancel={() => setGroupVisible(false)}
                value={[selGroup]}
                defaultValue={[selGroup]}
              />
            </Form.Item>
          )}
        </Form> */
}
