import { Popup, PopupProps } from "antd-mobile";
import AppHeader from "./AppHeader";
import { useEffect, useState } from "react";
import { useThemeStore } from "../store/themeStore";
import { colors } from "../colors";

interface CustomPopupProps extends PopupProps {
  title: string;
  height?: string;
  children: React.ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const CustomPopup = (props: CustomPopupProps) => {
  const isDarkMode = useThemeStore((state) => state.theme.isDarkMode);
  const [key, setKey] = useState(0);
  useEffect(() => {
    // visible 상태가 변경될 때마다 key를 업데이트하여 children을 리렌더링
    setKey((prevKey) => prevKey + 1);
  }, [props.visible]);
  return (
    <Popup
      visible={props.visible}
      onMaskClick={() => {
        props.setVisible(false);
      }}
      onClose={() => {
        props.setVisible(false);
      }}
      bodyStyle={{
        height: props.height || "60vh",
        overflow: "visible",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: isDarkMode ? colors.darkBlack : colors.lightWhite,
      }}
    >
      <AppHeader title={props.title} backIcon={false} />

      <div key={key} style={{ overflow: "auto", height: "80%" }}>
        {props.children}
      </div>
    </Popup>
  );
};

export default CustomPopup;
