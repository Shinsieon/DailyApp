import { Flex, message } from "antd";
import AppHeader from "../components/AppHeader";
import { TextArea } from "antd-mobile";
import { useState } from "react";
import BottomFixedButton from "../components/BottomFixedButton";
import { api } from "../api";

const SurveyPage = () => {
  const [survey, setSurvey] = useState("");
  const handleSend = async () => {
    if (!survey) {
      message.error("메시지를 입력해주세요.");

      return;
    }
    await api.sendSurvey(survey);
    message.success("의견이 전송되었습니다.");
    setSurvey("");
  };

  return (
    <Flex vertical style={{ height: "100vh" }}>
      <AppHeader title="의견 보내기" />
      <Flex vertical style={{ flex: 1, overflow: "auto" }}>
        <Flex
          vertical
          style={{
            padding: "20px",
            border: "1px solid #e5e5e5",
            borderRadius: "16px",
            margin: "20px",
          }}
        >
          <TextArea
            placeholder="자유롭게 의견을 보내주세요."
            value={survey}
            onChange={setSurvey}
            rows={10}
          />
          <BottomFixedButton
            name="보내기"
            onClick={() => {
              handleSend();
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SurveyPage;
