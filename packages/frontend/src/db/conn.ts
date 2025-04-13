import { openDB } from "idb";

const DB_NAME = "my-database";
const DB_VERSION = 2;
// IndexedDB 초기화 및 스토어 생성
export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log(`DB upgrade from version ${oldVersion} to ${newVersion}`);
      // 스토어가 존재하지 않으면 생성
      if (oldVersion < 1) {
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
      }
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains("diaryStore")) {
          const diaryStore = db.createObjectStore("diaryStore", {
            keyPath: "id",
            autoIncrement: true,
          });
          console.log("diaryStore created");
          diaryStore.createIndex("date", "date");
        }
      }
    },
  });
};

export const deleteDB = async () => {
  return indexedDB.deleteDatabase(DB_NAME);
};
//초기화하는 방법
// indexedDB.deleteDatabase("my-database");
