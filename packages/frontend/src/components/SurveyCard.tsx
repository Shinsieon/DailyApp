import { Flex, Image } from "antd";
import surveyor from "../assets/surveyor.png";
import Title from "./Title";
import Label from "./Label";
import { useNavigate } from "react-router-dom";

const SurveyCard = () => {
  const navigate = useNavigate();
  return (
    <Flex
      vertical
      style={{ padding: "10px" }}
      justify="center"
      align="center"
      onClick={() => {
        navigate("/surveyPage");
      }}
    >
      <Image
        src={surveyor}
        style={{ width: "50px", height: "50px", cursor: "none" }}
      />
      <Title level={4} name="지금까지 하루정리는 어땠나요?" />
      <Label name="의견 보내기" placeholder />
    </Flex>
  );
};

export default SurveyCard;
