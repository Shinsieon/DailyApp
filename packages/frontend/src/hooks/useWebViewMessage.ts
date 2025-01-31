import { useEffect } from "react";

const useWebViewMessage = (onMessageReceived: (data: any) => void) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        console.log(`🔵 Web에서 수신한 메시지:, ${event.data}`);
        const data = JSON.parse(event.data);
        // ✅ 메시지가 WebView에서 온 것이고, 올바른 구조인지 확인
        if (data.type) {
          console.log(`✅ WebView 메시지 처리:, ${data}`);
          onMessageReceived(data); // ✅ 콜백 함수 호출
        }
      } catch (error) {
        console.error(`🔴 메시지 처리 중 에러:, ${error}`);
      }
    };

    // ✅ 메시지 리스너 추가
    console.log("🟢 WebView 메시지 리스너 추가됨");
    window.addEventListener("message", handleMessage);

    return () => {
      console.log("🟠 WebView 메시지 리스너 제거됨");
      window.removeEventListener("message", handleMessage);
    };
  }, [onMessageReceived]);
};

export default useWebViewMessage;
