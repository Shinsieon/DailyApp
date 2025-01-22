import { useCallback, useEffect, useRef, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import scripts from "./scripts";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function Index() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  const webviewRef = useRef<WebView>(null);
  const onMessage = (payloads) => {
    let dataPayload;
    try {
      dataPayload = JSON.parse(payload.nativeEvent.data);
    } catch (e) {}

    if (dataPayload) {
      if (dataPayload.type === "Console") {
        console.info(`[Console] ${JSON.stringify(dataPayload.data)}`);
      } else if (dataPayload.type === "Copy") {
        console.log("copy", dataPayload);
        navigator.clipboard.writeText(dataPayload.data);
      } else if (dataPayload.type === "theme") {
        console.log("theme", dataPayload);
        setIsDarkMode(!isDarkMode);
        AsyncStorage.setItem("isDarkMode", JSON.stringify(!isDarkMode));
      } else {
        console.log(dataPayload);
      }
    }
  };
  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);
  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? "#333" : "#fff",
      }}
      onLayout={onLayoutRootView}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#333" : "#fff"}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <WebView
          ref={webviewRef}
          source={{ uri: "http://172.30.1.65:3000" }} // React 웹 페이지 URL
          style={styles.webview}
          javaScriptEnabled={true} // JavaScript 활성화
          domStorageEnabled={true} // DOM 저장소 활성화
          injectedJavaScript={scripts.debugging + scripts.injectedJavaScript}
          onMessage={onMessage}
          nestedScrollEnabled={true}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});
