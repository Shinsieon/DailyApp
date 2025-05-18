import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addData,
  clearData,
  dbStores,
  deleteData,
  getAllData,
  updateData,
} from "../db/operations";
import { DiaryData } from "../types";
import dayjs from "dayjs";

const storeName = dbStores.diaryStore;

export const diaryQuestions = [
  "하루 중 가장 기억에 남는 순간은 무엇인가요?",
  "오늘 당신의 기분은 어땠나요? 이모티콘으로 표현해도 좋아요.",
  "오늘 하루를 한 문장으로 요약한다면, 어떤 문장이 될까요?",
];

type DiaryState = {
  diary: DiaryData[];
  setDiary: (diary: DiaryData[]) => void;
  saveDiary: (diary: DiaryData) => Promise<void>;
  updateDiary: (diary: DiaryData) => Promise<void>;
  fetchDiary: () => Promise<void>;
  deleteDiary: (id: number) => Promise<void>;
  flushDiary: () => void;
};

export const useDiaryStore = create<DiaryState>()(
  persist(
    (set) => ({
      diary: [],
      setDiary: async (diary) => {
        await clearData(storeName);
        for (const d of diary) {
          d.date = dayjs(d.date).format("YYYYMMDD");
          await addData(storeName, d);
        }
        set({ diary });
      },
      saveDiary: async (diary) => {
        const key = await addData(storeName, diary);
        set((state) => ({ diary: [...state.diary, { ...diary, id: key }] }));
      },
      fetchDiary: async () => {
        const diary = (await getAllData<DiaryData>(storeName)).map((d) => {
          d.date = dayjs(d.date).format("YYYYMMDD");
          return d;
        });
        set({ diary });
      },
      updateDiary: async (diary) => {
        await updateData(storeName, diary);
        set((state) => ({
          diary: state.diary.map((m) => (m.id === diary.id ? diary : m)),
        }));
      },
      deleteDiary: async (id) => {
        await deleteData(storeName, id);
        set((state) => ({
          diary: state.diary.filter((diary) => diary.id !== id),
        }));
      },
      flushDiary: async () => set({ diary: [] }),
    }),
    {
      name: "diary-storage",
      partialize: (state) => ({ diary: state.diary }),
    }
  )
);
