import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AppLayout } from "./components/AppLayout";

createRoot(document.getElementById("root")!).render(
  <AppLayout>
    <RouterProvider router={router} />
  </AppLayout>
);
