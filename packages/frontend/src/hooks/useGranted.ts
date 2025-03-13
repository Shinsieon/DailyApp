import { useEffect, useState } from "react";
import { api } from "../api";
import { useUserStore } from "../store/userStore";
import { sendToNative } from "./useNative";

const useGranted = () => {
  const user = useUserStore((state) => state.user);
  const [isGranted, setIsGranted] = useState({
    isNativeGranted: false,
    isServerGranted: false,
    isUser: false,
  });
  useEffect(() => {
    sendToNative("checkNotificationGranted", {}, async (data: any) => {
      console.log(`useGranted: ${data.isGranted}`);
      if (!user) {
        setIsGranted({
          isNativeGranted: data.isGranted,
          isServerGranted: false,
          isUser: false,
        });
        return;
      } else if (!data.isGranted) {
        setIsGranted({
          isNativeGranted: data.isGranted,
          isServerGranted: false,
          isUser: true,
        });
        return;
      }
      const acceptPushServer = await api.getNotificationGranted(user.id);
      setIsGranted({
        isNativeGranted: data.isGranted,
        isServerGranted: acceptPushServer,
        isUser: true,
      });
    });
  }, []);
  return isGranted;
};

export default useGranted;
