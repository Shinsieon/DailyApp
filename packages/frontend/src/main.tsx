import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import BudgetPage from "./pages/BudgetPage.tsx";
import { AppLayout } from "./components/AppLayout.tsx";
import TodoPage from "./pages/TodoPage.tsx";
import MemoPage from "./pages/MemoPage.tsx";
import MemoEditPage from "./pages/MemoEditPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import Index from "./pages/Index.tsx";
import PatchNotePage from "./pages/PatchNotePage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/budget",
    element: <BudgetPage />,
  },
  {
    path: "/todo",
    element: <TodoPage />,
  },
  {
    path: "/memo",
    element: <MemoPage />,
  },
  {
    path: "/memoEdit",
    element: <MemoEditPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/patch-note",
    element: <PatchNotePage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <AppLayout>
    <RouterProvider router={router} />
  </AppLayout>
);
