import { Flex } from "antd";
import { Input, InputProps } from "antd-mobile";
import { colors, commonFieldStyle } from "../colors";
import Label from "./Label";
import { translateToKorean } from "../utils";
import { useEffect, useState } from "react";

const MoneyInput = (props: InputProps) => {
  const [inputValue, setInputValue] = useState<string | number>(
    props.value || ""
  );
  const handleInputChange = (value_: string) => {
    const value = value_.replace(/[^0-9]/g, ""); // 숫자만 허용
    setInputValue(value);
    if (props.onChange) {
      props.onChange(value);
    }
  };
  useEffect(() => {
    setInputValue(props.value || "");
  }, [props.value]);
  return (
    <Flex vertical>
      <Flex>
        <Input
          placeholder={props.placeholder}
          inputMode="numeric"
          value={inputValue + ""}
          style={commonFieldStyle}
          onChange={handleInputChange}
        />
      </Flex>
      {inputValue && Number(inputValue) > 0 && (
        <Label
          name={translateToKorean(Number(inputValue)) + "원"}
          style={{ color: colors.primary, textAlign: "right" }}
        />
      )}
    </Flex>
  );
};

export default MoneyInput;
