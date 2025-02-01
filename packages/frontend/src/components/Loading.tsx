import { SpinLoading } from "antd-mobile";

const CustomLoading = () => {
  return (
    <SpinLoading
      color="default"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};
export default CustomLoading;
