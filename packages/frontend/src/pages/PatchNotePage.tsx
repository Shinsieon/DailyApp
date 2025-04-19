import { Avatar, Empty, Flex } from "antd";
import AppHeader from "../components/AppHeader";
import { PatchNote } from "../types";
import { useEffect, useState } from "react";
import { api, showError } from "../api";
import { List } from "antd-mobile";
import Label from "../components/Label";
import avatar_man from "../assets/avatar_man.svg";
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
    <Flex vertical style={{ height: "100vh" }}>
      <AppHeader title="패치 노트" />
      <Flex vertical style={{ flex: 1, overflow: "auto" }}>
        {patchNotes ? (
          <List mode="card">
            {patchNotes.map((item) => (
              <List.Item prefix={<Avatar src={avatar_man} />}>
                <Flex vertical>
                  <div>{item.title}</div>
                  <Label name={item.description} placeholder />
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

export default PatchNotePage;
