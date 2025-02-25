const callbackRegistry: { [key: string]: (data: any) => void } = {};
window.addEventListener("message", (event) => {
  if (!window || !window.ReactNativeWebView) {
    return;
  }
  try {
    console.log(event.data);
    const { callbackId, data } = JSON.parse(event.data);
    console.log(`Received from native: ${callbackId}`);
    if (callbackId && callbackRegistry[callbackId]) {
      console.log(`Callback found: ${callbackId} sending data`);
      console.log(data);
      console.log(callbackRegistry[callbackId]);

      callbackRegistry[callbackId](data); // 저장된 콜백 실행
      delete callbackRegistry[callbackId]; // 실행 후 삭제
    }
  } catch (error) {
    console.error("Error processing native message:", error);
  }
});
export async function sendToNative(
  type: string,
  data?: any,
  callback?: (data: any) => void
) {
  if (window && window.ReactNativeWebView) {
    const callbackId = `cb_${Date.now()}_${Math.random()}`; // 고유한 ID 생성
    if (!callback) callback = () => {};
    callbackRegistry[callbackId] = callback; // 콜백 저장

    window.ReactNativeWebView.postMessage(
      JSON.stringify({ type, data, callbackId }) // 콜백 ID를 네이티브로 보냄
    );

    console.log(
      `Sent to native: ${JSON.stringify({ type, data, callbackId })}`
    );
  }
}

export function isNative() {
  return !!window.ReactNativeWebView;
}
