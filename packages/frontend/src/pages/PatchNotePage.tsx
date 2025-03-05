import { Avatar, Flex, List } from "antd";
import AppHeader from "../components/AppHeader";
import { PatchNote } from "../types";
import { useEffect, useState } from "react";
import { api, showError } from "../api";
import Empty from "../components/Empty";

const PatchNotePage = () => {
  const [patchNotes, setPatchNotes] = useState<PatchNote[] | null>(null);
  useEffect(() => {
    const fetchPatchNotes = async () => {
      try {
        const response = await api.getPatchNotes();
        if (!response || response.length === 0) {
          return;
        }
        setPatchNotes(response);
      } catch (error) {
        showError(error);
      }
    };
    fetchPatchNotes();
  }, []);

  return (
    <Flex vertical>
      <AppHeader title="패치 노트" />
      {patchNotes ? (
        <List
          style={{ width: "100%", padding: "0 20px", overflowY: "auto" }}
          itemLayout="horizontal"
          dataSource={patchNotes}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=1`}
                  />
                }
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty />
      )}
    </Flex>
  );
};

export default PatchNotePage;
