// filepath: /store/budgetUIStore.ts
import dayjs from "dayjs";
import { create } from "zustand";

interface BudgetUIState {
  selDate: string;
  setSelDate: (date: string) => void;
  detailVisible: boolean;
  setDetailVisible: (visible: boolean) => void;
}

export const useBudgetUIStore = create<BudgetUIState>((set) => ({
  selDate: dayjs().format("YYYYMMDD"),
  setSelDate: (date) => set({ selDate: date }),
  detailVisible: false,
  setDetailVisible: (visible) => set({ detailVisible: visible }),
}));
