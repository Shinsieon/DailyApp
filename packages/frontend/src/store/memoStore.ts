// filepath: /Users/sinsieon/ReactNative/myapp/packages/frontend/src/store/budgetStore.ts
import { create } from "zustand";
import { MemoData } from "../types";
import {
  addData,
  dbStores,
  deleteData,
  getAllData,
  getData,
  updateData,
} from "../db/operations";

type MemoState = {
  memos: MemoData[];
  fetchMemos: () => Promise<void>;
  saveMemo: (memo: MemoData) => Promise<void>;
  deleteMemo: (id: number) => Promise<void>;
  toggleMemo: (id: number) => Promise<void>;
  updateMemo: (memo: MemoData) => Promise<void>;
  flush: () => void;
};
const storeName = dbStores.memoStore;
export const useMemoStore = create<MemoState>((set) => ({
  memos: [],
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
  flush: async () => set({ memos: [] }),
}));
