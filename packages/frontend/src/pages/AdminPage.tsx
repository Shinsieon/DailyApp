import { Empty, Flex, List, Table } from "antd";
import { useEffect, useState } from "react";
import { api, showError } from "../api";
import AppHeader from "../components/AppHeader";
import Label from "../components/Label";
import { User, useUserStore } from "../store/userStore";
import { Tabs } from "antd-mobile";
import { PatchNote, SurveyData } from "../types";

const AdminPage = () => {
  const user = useUserStore((state) => state.user);
  const [users, setUsers] = useState<User[]>([]);
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [patchNotes, setPatchNotes] = useState<PatchNote[]>([]);
  useEffect(() => {
    api.apiSender(api.getUsers, setUsers);
    api.apiSender(api.getSurvey, setSurveys);
    api.apiSender(api.getPatchNotes, setPatchNotes);
  }, []);

  return (
    <Flex vertical style={{ height: "100vh" }}>
      <AppHeader title="관리자 페이지" />
      <Flex vertical style={{ flex: 1, overflow: "auto" }}>
        {!user || user.is_superuser === false ? (
          <Empty description="권한이 없습니다." />
        ) : (
          <Flex vertical>
            <Tabs defaultActiveKey="1">
              <Tabs.Tab title="사용자 관리" key="1">
                <Flex>
                  {users.length === 0 ? (
                    <Empty description="사용자가 없습니다." />
                  ) : (
                    <Table
                      style={{ width: "100%" }}
                      dataSource={users}
                      columns={Object.keys(users[0]).map((key) => ({
                        title: key,
                        dataIndex: key,
                        key: key,
                      }))}
                    />
                  )}
                </Flex>
              </Tabs.Tab>
              <Tabs.Tab title="피드백 관리" key="2">
                <Flex>
                  {surveys.length === 0 ? (
                    <Empty description="피드백이 없습니다." />
                  ) : (
                    <Table
                      style={{ width: "100%" }}
                      dataSource={surveys}
                      columns={Object.keys(surveys[0]).map((key) => ({
                        title: key,
                        dataIndex: key,
                        key: key,
                      }))}
                    />
                  )}
                </Flex>
              </Tabs.Tab>
              <Tabs.Tab title="패치노트 관리" key="3">
                <Flex>
                  {patchNotes.length === 0 ? (
                    <Empty description="패치노트가 없습니다." />
                  ) : (
                    <Table
                      style={{ width: "100%" }}
                      dataSource={patchNotes}
                      columns={Object.keys(patchNotes[0]).map((key) => ({
                        title: key,
                        dataIndex: key,
                        key: key,
                      }))}
                    />
                  )}
                </Flex>
              </Tabs.Tab>
            </Tabs>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default AdminPage;
