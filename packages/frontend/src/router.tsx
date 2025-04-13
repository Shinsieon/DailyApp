import React from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";

// pages 폴더의 모든 페이지를 동적으로 가져오기 (Vite 전용)
const pageModules = import.meta.glob("./pages/*Page.tsx", { eager: true });

// Index 페이지는 따로 import
import Index from "./Index";
import ErrorPage from "./pages/ErrorPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
  },
];

// 각 페이지 모듈을 기반으로 route 추가
for (const path in pageModules) {
  const module: any = pageModules[path];
  const fileNameMatch = path.match(/\.\/pages\/(.*)\.tsx$/);

  if (!fileNameMatch) continue;

  const fileName = fileNameMatch[1]; // e.g., BudgetPage
  const routePath = "/" + fileName.charAt(0).toLowerCase() + fileName.slice(1);

  routes.push({
    path: routePath,
    element: React.createElement(module.default),
    errorElement: <ErrorPage />,
  });
}

export const router = createBrowserRouter(routes);
