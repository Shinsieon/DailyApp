import { Button, Result } from "antd";
import { useEffect } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { sendToTelegram } from "../telegram";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const navigate = useNavigate();
  useEffect(() => {
    sendToTelegram(error.message);
  }, []);

  return (
    <Result
      status="error"
      title="Something went wrong"
      subTitle={error.message}
      extra={[
        <Button type="primary" onClick={resetErrorBoundary} key="tryAgain">
          Try again
        </Button>,
        <Button type="default" onClick={() => navigate("/")} key="home">
          Home
        </Button>,
      ]}
    />
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
