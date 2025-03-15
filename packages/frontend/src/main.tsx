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
import Index from "./Index.tsx";
import PatchNotePage from "./pages/PatchNotePage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ChangeNickNamePage from "./pages/ChangeNickNamePage.tsx";
import WeatherPage from "./pages/WeatherPage.tsx";
import SurveyPage from "./pages/SurveyPage.tsx";
import TodoEditPage from "./pages/TodoEditPage.tsx";
import BudgetEditPage from "./pages/BudgetEditPage.tsx";

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
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/change-nickname",
    element: <ChangeNickNamePage />,
  },
  {
    path: "/weather",
    element: <WeatherPage />,
  },
  {
    path: "/survey",
    element: <SurveyPage />,
  },
  {
    path: "/editTodo",
    element: <TodoEditPage />,
  },
  {
    path: "/editBudget",
    element: <BudgetEditPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <AppLayout>
    <RouterProvider router={router} />
  </AppLayout>
);
