// filepath: /Users/sinsieon/ReactNative/myapp/packages/frontend/src/store/budgetStore.ts
import { create } from "zustand";
import { BudgetData } from "../types";
import {
  addData,
  dbStores,
  deleteData,
  getAllData,
  updateData,
} from "../db/operations";
import dayjs from "dayjs";

type BudgetState = {
  budgets: BudgetData[];
  setBudgets: (budgets: BudgetData[]) => void;
  fetchBudgets: () => Promise<void>;
  saveBudget: (budget: BudgetData) => Promise<void>;
  deleteBudget: (id: number) => Promise<void>;
  updateBudget: (budget: BudgetData) => Promise<void>;
  flushBudgets: () => void;
};
const storeName = dbStores.budgetStore;
export const useBudgetStore = create<BudgetState>((set) => ({
  budgets: [],
  setBudgets: (budgets) => {
    budgets.forEach((budget) => {
      budget.date = dayjs(budget.date).format("YYYYMMDD");
      budget.amount = Number(budget.amount);
    });
    set({ budgets });
  },
  fetchBudgets: async () => {
    const budgets = await getAllData<BudgetData>(storeName);
    set({ budgets });
  },
  saveBudget: async (budget) => {
    console.log(budget);
    const key = await addData(storeName, budget);
    set((state) => ({ budgets: [...state.budgets, { ...budget, id: key }] }));
  },
  updateBudget: async (budget) => {
    await updateData(storeName, budget);
    console.log(budget);
    set((state) => ({
      budgets: state.budgets.map((m) => (m.id === budget.id ? budget : m)),
    }));
  },
  deleteBudget: async (id) => {
    await deleteData(storeName, id);
    set((state) => ({
      budgets: state.budgets.filter((budget) => budget.id !== id),
    }));
  },
  flushBudgets: async () => set({ budgets: [] }),
}));
