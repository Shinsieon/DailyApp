// ErrorPage.jsx
import { Flex } from "antd";
import { useRouteError } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { sendToTelegram } from "../telegram";

export default function ErrorPage() {
  const error = useRouteError();
  console.error("Router Error:", error);
  sendToTelegram(
    `Error: ${error.statusText || error.message}\n\n${JSON.stringify(error)}`
  );
  return (
    // <div>
    //   <h1>Oops! Something went wrong 😬</h1>
    //   <p>{error.statusText || error.message}</p>
    // </div>
    <Flex vertical style={{ height: "100vh" }}>
      {/* 100vh 지우지말것 */}
      <AppHeader title="Error Page" />
    </Flex>
  );
}
