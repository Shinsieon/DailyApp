// filepath: /Users/sinsieon/ReactNative/myapp/packages/frontend/src/store/budgetStore.ts
import { create } from "zustand";
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
export const useMemoStore = create<MemoState>((set) => ({
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

    set({ memos: memos });
  },

  saveMemo: async (memo) => {
    const key = await addData(storeName, memo);
    set((state) => ({ memos: [...state.memos, { ...memo, id: key }] }));
  },
  deleteMemo: async (id) => {
    await deleteData(storeName, id);
    set((state) => ({
      memos: state.memos.filter((memo) => memo.id !== id),
    }));
  },
  toggleMemo: async (id: number) => {
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
}));
