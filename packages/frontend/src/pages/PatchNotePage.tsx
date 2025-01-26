import { Avatar, Empty, Flex, List } from "antd";
import AppHeader from "../components/AppHeader";
import { PatchNote } from "../types";
import { useEffect, useState } from "react";
import { api, showError } from "../api";

const PatchNotePage = () => {
  const [patchNotes, setPatchNotes] = useState<PatchNote[] | null>(null);
  useEffect(() => {
    const fetchPatchNotes = async () => {
      try {
        console.log("getting patch notes");
        const response = await api.getPatchNotes();
        if (!response || response.length === 0) {
          return;
        }
        setPatchNotes(response);
        console.log(response);
      } catch (error) {
        showError(error);
      }
    };
    fetchPatchNotes();
  }, []);

  return (
    <Flex vertical style={{ width: "100%" }}>
      <AppHeader title="패치 노트" />
      {patchNotes ? (
        <List
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
        <Empty description="패치 노트가 없습니다." />
      )}
    </Flex>
  );
};

export default PatchNotePage;
