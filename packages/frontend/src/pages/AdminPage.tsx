import { Flex, List } from "antd";
import { useEffect, useState } from "react";
import { api, showError } from "../api";
import AppHeader from "../components/AppHeader";
import Empty from "../components/Empty";
import Label from "../components/Label";

const AdminPage = () => {
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
        {users.length > 0 ? (
          <List>
            {users.map((user: any) => (
              <List.Item>
                <Flex vertical>
                  <div>{user.name}</div>
                  <Label name={user.email} placeholder />
                </Flex>
              </List.Item>
            ))}
          </List>
        ) : (
          <Empty />
        )}
      </Flex>
    </Flex>
  );
};

export default AdminPage;
