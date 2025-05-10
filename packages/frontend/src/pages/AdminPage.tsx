import { Empty, Flex, List } from "antd";
import { useEffect, useState } from "react";
import { api, showError } from "../api";
import AppHeader from "../components/AppHeader";
import Label from "../components/Label";
import { useUserStore } from "../store/userStore";

const AdminPage = () => {
  const user = useUserStore((state) => state.user);
  console.log(`is superuser ${user?.is_superuser}`);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.getUsers();
        if (!response || response.length === 0) {
          return;
        }
        setUsers(response);
      } catch (error) {
        showError(error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Flex vertical style={{ height: "100vh" }}>
      <AppHeader title="관리자 페이지" />
      <Flex vertical style={{ flex: 1, overflow: "auto" }}>
        {!user || user.is_superuser === false ? (
          <Empty description="권한이 없습니다." />
        ) : (
          <></>
        )}
      </Flex>
    </Flex>
  );
};

export default AdminPage;
