import { initDB } from "./conn";

export const dbStores = {
  budgetStore: "budgetStore",
  todoStore: "todoStore",
  memoStore: "memoStore",
  themeStore: "themeStore",
  diaryStore: "diaryStore",
};
// 데이터 추가
export const addData = async <T>(storeName: string, data: T) => {
  const { tx, store } = await getStore(storeName);
  const key = parseInt((await store.add(data)) as unknown as string);
  await tx.done;
  return key;
};

export const updateData = async <T>(
  storeName: string,
  data: T,
  key?: string
) => {
  const { tx, store } = await getStore(storeName);
  await store.put(data, key);
  await tx.done;
};

export const clearData = async (storeName: string) => {
  const { tx, store } = await getStore(storeName);
  await store.clear();
  await tx.done;
};
// 데이터 조회
export const getData = async (storeName: string, id: number | string) => {
  const { tx, store } = await getStore(storeName);
  const data = await store.get(id);
  await tx.done;
  return data;
};

// 모든 데이터 조회
export const getAllData = async <T>(
  storeName: string,
  startDate?: string,
  endDate?: string
): Promise<T[]> => {
  const { tx, store } = await getStore(storeName);
  let data: T[] = [];
  if (startDate && endDate) {
    const range = IDBKeyRange.bound(startDate, endDate);
    data = (await store.index("date").getAll(range)) as unknown as T[];
  } else {
    data = (await store.getAll()) as unknown as T[];
  }
  await tx.done;
  return data;
};

export const getDataByDate = async (storeName: string, date: Date) => {
  const { tx, store } = await getStore(storeName);
  if (!store.indexNames.contains("date")) {
    return [];
  }
  const index = store.index("date");
  const data = await index.getAll(date);
  await tx.done;
  return data;
};

// 데이터 삭제
export const deleteData = async (storeName: string, id: number) => {
  const { tx, store } = await getStore(storeName);
  await store.delete(id);
  await tx.done;
};

async function getStore(storeName: string) {
  console.log(`getStore: ${storeName}`);
  const db = await initDB();
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);
  return { tx, store };
}
