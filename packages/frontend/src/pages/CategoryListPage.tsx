import { Flex, message } from "antd";
import AppHeader from "../components/AppHeader";
import { CapsuleTabs, Grid, Input, Modal } from "antd-mobile";
import { BudgetType, CategoryData } from "../types";
import { useEffect, useState } from "react";
import { api } from "../api";
import { useUserStore } from "../store/userStore";
import Label from "../components/Label";
import sizes from "../sizes";
import { colors } from "../colors";
import { TiDelete } from "react-icons/ti";

const CategoryListPage = () => {
  const [defaultCategory, setDefaultCategory] = useState<CategoryData[]>([]);
  const [myCategory, setMyCategory] = useState<CategoryData[]>([]);
  const user = useUserStore((state) => state.user);
  const [visible, setVisible] = useState(false);
  const [newCategory, setNewCategory] = useState<CategoryData | null>(null);
  const handleAddClick = async () => {
    if (!newCategory?.label) {
      message.error("카테고리 이름을 입력해주세요.");
      return;
    }
    const result = await api.createCategory(user!.id, newCategory);
    console.log(`result: ${JSON.stringify(result)}`);
    if (result) {
      message.success("카테고리가 추가되었습니다.");
      setMyCategory([...myCategory, result]);
      setNewCategory(null);
      setVisible(false);
    } else {
      message.error("카테고리 추가에 실패했습니다.");
    }
  };
  const handleUpdateClick = async (cat: CategoryData) => {
    setNewCategory(cat);
    setVisible(true);
  };
  const handleCreateClick = async (type: BudgetType) => {
    setNewCategory({ type, label: "", value: "" });
    setVisible(true);
  };
  const handleUpdate = async (id: number) => {
    if (!newCategory) {
      message.error("카테고리 이름을 입력해주세요.");
      return;
    }
    const result = await api.updateCategory(user!.id, id, newCategory);
    if (result) {
      message.success("카테고리가 수정되었습니다.");
      fetchMyCategories();
      setNewCategory(null);
      setVisible(false);
    } else {
      message.error("카테고리 수정에 실패했습니다.");
    }
  };
  const fetchDefaultCategories = async () => {
    const defaultCategories = await api.getCategories();
    for (let i = 0; i < defaultCategories.length; i++) {
      defaultCategories[i].value = defaultCategories[i].label;
    }
    setDefaultCategory(defaultCategories);
  };
  const fetchMyCategories = async () => {
    const myCategories = await api.getCategories(user!.id);
    for (let i = 0; i < myCategories.length; i++) {
      myCategories[i].value = myCategories[i].label;
    }
    setMyCategory(myCategories);
  };
  const handleDeleteClick = async (id: number) => {
    await api.deleteCategory(user!.id, id);
    message.success("카테고리가 삭제되었습니다.");
    fetchMyCategories();
  };
  useEffect(() => {
    fetchDefaultCategories();
    fetchMyCategories();
  }, []);
  return (
    <Flex vertical>
      <AppHeader title="카테고리 설정" />
      <Flex
        vertical
        style={{ flex: 1, overflowY: "auto", padding: "0px 20px" }}
      >
        <CapsuleTabs>
          <CapsuleTabs.Tab title="기본 카테고리" key="default">
            <Flex vertical gap={10}>
              <Flex vertical gap={10}>
                <Flex style={{ flex: 1, borderRight: "1px solid #f0f0f0" }}>
                  <Label
                    name="수입"
                    style={{
                      fontSize: sizes.font.xlarge,
                      fontWeight: "bold",
                      minWidth: 50,
                    }}
                  />
                </Flex>
                <Grid columns={3} gap={20} style={{ flex: 8 }}>
                  {defaultCategory
                    .filter((item) => item.type === "income")
                    .map((category) => (
                      <Label
                        name={category.label}
                        style={{
                          backgroundColor: colors.lightTomato,
                          color: colors.lightWhite,
                          padding: 5,
                          borderRadius: 5,
                        }}
                      />
                    ))}
                </Grid>
              </Flex>
              <Flex vertical gap={10}>
                <Flex style={{ flex: 1, borderRight: "1px solid #f0f0f0" }}>
                  <Label
                    name="지출"
                    style={{
                      fontSize: sizes.font.xlarge,
                      fontWeight: "bold",
                      minWidth: 50,
                    }}
                  />
                </Flex>
                <Grid columns={3} gap={20} style={{ flex: 8 }}>
                  {defaultCategory
                    .filter((item) => item.type === "expense")
                    .map((category) => (
                      <Label
                        name={category.label}
                        style={{
                          backgroundColor: colors.lightPrimary,
                          padding: 5,
                          borderRadius: 5,
                        }}
                      />
                    ))}
                </Grid>
              </Flex>
            </Flex>
          </CapsuleTabs.Tab>
          <CapsuleTabs.Tab title="내 카테고리" key="my">
            <Flex vertical gap={10}>
              <Flex vertical gap={10}>
                <Flex style={{ flex: 1, borderRight: "1px solid #f0f0f0" }}>
                  <Label
                    name="수입"
                    style={{
                      fontSize: sizes.font.xlarge,
                      fontWeight: "bold",
                      minWidth: 50,
                    }}
                  />
                </Flex>
                <Grid columns={3} gap={20} style={{ flex: 8 }}>
                  {myCategory
                    .filter((item) => item.type === "income")
                    .map((category) => (
                      <Flex>
                        <Label
                          name={category.label}
                          style={{
                            backgroundColor: colors.lightTomato,
                            color: colors.lightWhite,
                            padding: 5,
                            borderRadius: 5,
                          }}
                          onClick={() => {
                            handleUpdateClick(category);
                          }}
                        />
                        <TiDelete
                          style={{ fontSize: 20 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(category.id!);
                          }}
                        />
                      </Flex>
                    ))}
                  <Label
                    name="추가"
                    style={{
                      backgroundColor: colors.lightWhite,
                      color: colors.lightTomato,
                      border: `1px solid ${colors.lightTomato}`,
                      borderStyle: "dashed",
                      padding: 5,
                      borderRadius: 5,
                    }}
                    onClick={() => {
                      handleCreateClick("income");
                    }}
                  />
                </Grid>
              </Flex>
              <Flex vertical gap={10}>
                <Flex style={{ flex: 1, borderRight: "1px solid #f0f0f0" }}>
                  <Label
                    name="지출"
                    style={{
                      fontSize: sizes.font.xlarge,
                      fontWeight: "bold",
                      minWidth: 50,
                    }}
                  />
                </Flex>
                <Grid columns={3} gap={20} style={{ flex: 8 }}>
                  {myCategory
                    .filter((item) => item.type === "expense")
                    .map((category) => (
                      <Flex>
                        <Label
                          name={category.label}
                          style={{
                            backgroundColor: colors.lightPrimary,
                            padding: 5,
                            borderRadius: 5,
                          }}
                          onClick={() => {
                            handleUpdateClick(category);
                          }}
                        />
                        <TiDelete
                          style={{ fontSize: 20 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(category.id!);
                          }}
                        />
                      </Flex>
                    ))}
                  <Label
                    name="추가"
                    style={{
                      backgroundColor: colors.lightWhite,
                      color: colors.primary,
                      padding: 5,
                      borderRadius: 5,
                      border: `1px solid ${colors.primary} `,
                      borderStyle: "dashed",
                    }}
                    onClick={() => {
                      handleCreateClick("expense");
                    }}
                  />
                </Grid>
              </Flex>
            </Flex>
          </CapsuleTabs.Tab>
        </CapsuleTabs>
        <Modal
          visible={visible}
          closeOnMaskClick
          content={
            <Flex>
              <Input
                value={newCategory?.label}
                onChange={(value) => {
                  setNewCategory({ ...newCategory!, label: value });
                }}
                placeholder={`새 카테고리를 입력해주세요`}
                style={{
                  backgroundColor: colors.lightGray,
                  borderRadius: 10,
                  width: "100%",
                  padding: 5,
                }}
              />
            </Flex>
          }
          closeOnAction
          onClose={() => {
            setVisible(false);
          }}
          actions={[
            {
              key: "confirm",
              text: newCategory?.id ? "수정" : "추가",
              onClick: newCategory?.id
                ? () => handleUpdate(newCategory.id!)
                : handleAddClick,
            },
          ]}
        />
      </Flex>
    </Flex>
  );
};

export default CategoryListPage;
