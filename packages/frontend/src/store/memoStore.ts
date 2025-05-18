import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MemoData } from "../types";
import {
  addData,
  clearData,
  dbStores,
  deleteData,
  getAllData,
  getData,
  updateData,
} from "../db/operations";
import dayjs from "dayjs";
import { sendToNative } from "../hooks/useNative";

type MemoState = {
  memos: MemoData[];
  fetchMemos: () => Promise<void>;
  setMemos: (memos: MemoData[]) => void;
  saveMemo: (memo: MemoData) => Promise<void>;
  deleteMemo: (id: number) => Promise<void>;
  toggleMemo: (id: number) => Promise<void>;
  updateMemo: (memo: MemoData) => Promise<void>;
  flushMemos: () => void;
};

const storeName = dbStores.memoStore;

export const useMemoStore = create<MemoState>()(
  persist(
    (set) => ({
      memos: [],
      setMemos: async (memos) => {
        await clearData(storeName);
        memos.forEach((memo) => {
          memo.group = memo.group || "기본";
          memo.date = dayjs(memo.date).format("YYYYMMDD");
          addData(storeName, memo);
        });
        set({ memos });
      },
      fetchMemos: async () => {
        const memos = (await getAllData<MemoData>(storeName)).map((m) => {
          m.group = m.group || "기본";
          return m;
        });
        set({ memos });
      },
      saveMemo: async (memo) => {
        console.log("saving memo");
        const key = await addData(storeName, memo);
        set((state) => ({ memos: [...state.memos, { ...memo, id: key }] }));
      },
      deleteMemo: async (id) => {
        await deleteData(storeName, id);
        set((state) => ({
          memos: state.memos.filter((memo) => memo.id !== id),
        }));
      },
      toggleMemo: async (id) => {
        const memo = await getData(storeName, id);
        if (!memo) return;
        memo.favorite = !memo.favorite;
        await updateData(storeName, memo);
        set((state) => ({
          memos: state.memos.map((m) => (m.id === id ? memo : m)),
        }));
      },
      updateMemo: async (memo) => {
        await updateData(storeName, memo);
        set((state) => ({
          memos: state.memos.map((m) => (m.id === memo.id ? memo : m)),
        }));
      },
      flushMemos: async () => set({ memos: [] }),
    }),
    {
      name: "memo-storage", // localStorage 키
      partialize: (state) => ({ memos: state.memos }), // 상태 중 저장할 항목
    }
  )
);

// Native에 상태 전송
useMemoStore.subscribe((state) => {
  sendToNative("widgetData", {
    memos: state.memos,
  });
});
