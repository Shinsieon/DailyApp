import { create } from "zustand";
import {
  addData,
  dbStores,
  deleteData,
  getAllData,
  getData,
  updateData,
} from "../db/operations";
import { TodoData } from "../types";
import dayjs from "dayjs";

type TodoState = {
  todos: TodoData[];
  setTodos: (todos: TodoData[]) => void;
  fetchTodos: () => Promise<void>;
  saveTodo: (todo: TodoData) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  flushTodos: () => void;
};

const storeName = dbStores.todoStore;

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  setTodos: (todos) => {
    todos.forEach((todo) => {
      todo.date = dayjs(todo.date).format("YYYYMMDD");
    });
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
    console.log(todo);
    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };
      console.log(updatedTodo);
      await updateData(storeName, updatedTodo);
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? updatedTodo : t)),
      }));
    }
  },
  flushTodos: async () => set({ todos: [] }),
}));
