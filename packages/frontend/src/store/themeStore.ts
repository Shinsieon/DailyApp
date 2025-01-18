// filepath: /Users/sinsieon/ReactNative/myapp/packages/frontend/src/store/themeStore.ts

import { create } from "zustand";
import { dbStores, getData, updateData } from "../db/operations";
import { ThemeData } from "../types";

type ThemeState = {
  theme: ThemeData;
  fetchTheme: () => void;
  toggleTheme: () => void;
};
const storeName = dbStores.themeStore;
const storeKey = "theme";
export const useThemeStore = create<ThemeState>((set) => ({
  theme: { isDarkMode: false },
  fetchTheme: async () => {
    const theme = await getData(storeName, storeKey);
    if (theme) {
      set({ theme });
    } else {
      updateData(storeName, { isDarkMode: false }, storeKey);
    }
  },
  toggleTheme: () => {
    set((state) => {
      const updatedTheme = {
        ...state.theme,
        isDarkMode: !state.theme.isDarkMode,
      };
      updateData(storeName, updatedTheme, storeKey);
      if (window && window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: "theme", isDarkMode: updatedTheme.isDarkMode })
        );
      }

      return { theme: updatedTheme };
    });
  },
}));
