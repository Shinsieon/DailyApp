import { ErrorBlock } from "antd-mobile";

const Empty = () => {
  return (
    <ErrorBlock status={"empty"} title="" description="데이터가 없습니다." />
  );
};

export default Empty;
