import { openDB } from "idb";

const DB_NAME = "my-database";
// IndexedDB 초기화 및 스토어 생성
export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("budgetStore")) {
        const budgetStore = db.createObjectStore("budgetStore", {
          keyPath: "id",
          autoIncrement: true,
        });
        console.log("budgetStore created");
        budgetStore.createIndex("date", "date");
      }
      if (!db.objectStoreNames.contains("todoStore")) {
        const todoStore = db.createObjectStore("todoStore", {
          keyPath: "id",
          autoIncrement: true,
        });
        console.log("todoStore created");
        todoStore.createIndex("date", "date");
      }
      if (!db.objectStoreNames.contains("memoStore")) {
        const memoStore = db.createObjectStore("memoStore", {
          keyPath: "id",
          autoIncrement: true,
        });
        console.log("memoStore created");
        memoStore.createIndex("date", "date");
      }
      if (!db.objectStoreNames.contains("themeStore")) {
        db.createObjectStore("themeStore");
        console.log("themeStore created");
        // 기본 데이터 삽입
      }
    },
  });
};

export const deleteDB = async () => {
  return indexedDB.deleteDatabase(DB_NAME);
};
//초기화하는 방법
// indexedDB.deleteDatabase("my-database");
