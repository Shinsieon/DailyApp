import { Flex, message } from "antd";
import AppHeader from "../components/AppHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Cascader, Form, Input, Switch, TextArea } from "antd-mobile";
import { MemoData } from "../types";
import { useMemoStore } from "../store/memoStore";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { CheckListValue } from "antd-mobile/es/components/check-list";
import Label from "../components/Label";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";
import TextField from "../components/TextField";

const MemoEditPage = () => {
  const [groupVisible, setGroupVisible] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [newGroup, setNewGroup] = useState<string>("");
  const location = useLocation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const memos = useMemoStore((state) => state.memos);
  const groups =
    memos.length > 0 ? [...new Set(memos.map((memo) => memo.group))] : ["기본"];
  const saveMemo = useMemoStore((state) => state.saveMemo);
  const updateMemo = useMemoStore((state) => state.updateMemo);
  const memoId = location.state?.memoId;
  const isDarkMode = useThemeStore((state) => state.theme.isDarkMode);
  const prevMemo = useMemoStore((state) =>
    state.memos.find((memo) => memo.id === memoId)
  );
  const [selGroup, setSelGroup] = useState<string>(prevMemo?.group || "기본");

  useEffect(() => {
    if (prevMemo) {
      updateMemo({ ...prevMemo, showCount: (prevMemo.showCount || 0) + 1 });
    }
  }, []);

  const onfinish = async () => {
    const values = form.getFieldsValue() as MemoData;
    if (isNewGroup && !newGroup) {
      message.error("그룹명을 입력해주세요.");
      return;
    }
    const { title, content, secret = false, favorite = false } = values;
    try {
      if (prevMemo) {
        updateMemo({
          ...prevMemo,
          title,
          content,
          secret,
          group: isNewGroup ? newGroup : selGroup,
          favorite,
        });
      } else {
        saveMemo({
          title,
          content,
          secret,
          group: isNewGroup ? newGroup : selGroup,
          date: dayjs().format("YYYYMMDD"),
          favorite: favorite,
          showCount: 0,
        });
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
    <Flex vertical>
      <AppHeader title={`메모 ${prevMemo ? "수정" : "추가"}`} />
      <Form
        layout="horizontal"
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
          style={{
            backgroundColor: isDarkMode ? colors.darkBlack : colors.lightWhite,
            color: isDarkMode ? colors.lightWhite : colors.darkBlack,
          }}
          rules={[{ required: true, message: "제목을 입력해주세요." }]}
          initialValue={prevMemo?.title}
        >
          <Input placeholder="제목을 입력해주세요." />
        </Form.Item>
        <Form.Item
          name="content"
          label="내용"
          style={{
            backgroundColor: isDarkMode ? colors.darkBlack : colors.lightWhite,
            color: isDarkMode ? colors.lightWhite : colors.darkBlack,
          }}
          rules={[{ required: true, message: "내용을 입력해주세요." }]}
          initialValue={prevMemo?.content}
        >
          <TextArea
            placeholder="내용을 입력해주세요."
            maxLength={300}
            rows={10}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="isNewGroup"
          label="그룹생성 여부"
          style={{
            backgroundColor: isDarkMode ? colors.darkBlack : colors.lightWhite,
            color: isDarkMode ? colors.lightWhite : colors.darkBlack,
          }}
          valuePropName="checked"
          childElementPosition="right"
        >
          <Switch onChange={setIsNewGroup} />
        </Form.Item>
        {isNewGroup ? (
          <Form.Item
            name="newGroup"
            label="그룹이름"
            style={{
              backgroundColor: isDarkMode
                ? colors.darkBlack
                : colors.lightWhite,
              color: isDarkMode ? colors.lightWhite : colors.darkBlack,
            }}
          >
            <TextField
              onChange={setNewGroup}
              placeholder="그룹명을 입력해주세요."
            />
          </Form.Item>
        ) : null}
        <Form.Item
          label="그룹"
          childElementPosition="right"
          style={{
            backgroundColor: isDarkMode ? colors.darkBlack : colors.lightWhite,
            color: isDarkMode ? colors.lightWhite : colors.darkBlack,
          }}
          onClick={() => setGroupVisible(true)}
        >
          <Label name={selGroup} />
          <Cascader
            options={groups.map((group) => ({ label: group, value: group }))}
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
        <Form.Item
          name="favorite"
          style={{
            backgroundColor: isDarkMode ? colors.darkBlack : colors.lightWhite,
            color: isDarkMode ? colors.lightWhite : colors.darkBlack,
          }}
          label="즐겨찾기 여부"
          valuePropName="checked"
          childElementPosition="right"
          initialValue={prevMemo?.favorite}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Flex>
  );
};
export default MemoEditPage;
