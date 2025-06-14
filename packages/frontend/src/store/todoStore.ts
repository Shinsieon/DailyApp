import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addData,
  clearData,
  dbStores,
  deleteData,
  getAllData,
  getData,
  updateData,
} from "../db/operations";
import { TodoData } from "../types";
import dayjs from "dayjs";
import { sendToNative } from "../hooks/useNative";

type TodoState = {
  todos: TodoData[];
  setTodos: (todos: TodoData[]) => void;
  fetchTodos: () => Promise<void>;
  saveTodo: (todo: TodoData) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  updateTodo: (id: number, todo: TodoData) => Promise<void>;
  flushTodos: () => void;
};

const storeName = dbStores.todoStore;

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      setTodos: async (todos) => {
        await clearData(storeName);

        for (const todo of todos) {
          todo.date = dayjs(todo.date).format("YYYYMMDD");
          if (todo.endDate) {
            todo.endDate = dayjs(todo.endDate).format("YYYYMMDD");
          }
          await addData(storeName, todo);
        }

        set({ todos });
      },
      fetchTodos: async () => {
        const todos = await getAllData<TodoData>(storeName);
        set({ todos });
      },
      saveTodo: async (todo) => {
        const key = await addData(storeName, todo);
        set((state) => ({ todos: [...state.todos, { ...todo, id: key }] }));
      },
      deleteTodo: async (id) => {
        await deleteData(storeName, id);
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },
      toggleTodo: async (id) => {
        const todo = await getData(storeName, id);
        if (todo) {
          const updatedTodo = { ...todo, completed: !todo.completed };
          await updateData(storeName, updatedTodo);
          set((state) => ({
            todos: state.todos.map((t) => (t.id === id ? updatedTodo : t)),
          }));
        }
      },
      updateTodo: async (id, todo) => {
        await updateData(storeName, todo);
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? todo : t)),
        }));
      },
      flushTodos: async () => set({ todos: [] }),
    }),
    {
      name: "todo-storage",
      partialize: (state) => ({ todos: state.todos }),
    }
  )
);

// Native에 상태 전송
useTodoStore.subscribe((state) => {
  sendToNative("widgetData", {
    todos: state.todos,
  });
});
