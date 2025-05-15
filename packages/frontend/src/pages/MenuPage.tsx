import { Flex, message } from "antd";
import { Button, List, SearchBar } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { colors } from "../colors";
import sizes from "../sizes";
import Label from "../components/Label";
import { AiOutlineDelete } from "react-icons/ai";
import { useUserStore } from "../store/userStore";
interface MenuData {
  title: string;
  path?: string;
  state?: any;
  requireLoggin?: boolean;
  children?: MenuData[];
  onClick?: () => void;
}

const MenuPage = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [menuHistory, setMenuHistory] = useState<MenuData[]>([]);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const customNavigate = (menu: MenuData) => {
    console.log(`menu ${JSON.stringify(menu.state)}`);
    if (menuHistory.length > 0) {
      let newHistory: MenuData[] = menuHistory.filter(
        (item) => item.path !== menu.path
      );
      newHistory = [menu, ...newHistory];

      localStorage.setItem("menuHistory", JSON.stringify(newHistory));
    } else {
      setMenuHistory([menu]);
      localStorage.setItem("menuHistory", JSON.stringify([menu]));
    }
    console.log(`menuHistory ${JSON.stringify(menuHistory)}`);
    navigate(menu.path!, {
      state: menu.state,
    });
  };
  const handleMenuClick = (menu: MenuData) => {
    if (menu.requireLoggin && !user) {
      message.error("로그인이 필요합니다.");
      return;
    }
    if (menu.path) {
      customNavigate(menu);
    } else if (menu.onClick) {
      menu.onClick();
    }
  };
  const deleteMenuHistory = (index: number) => {
    const newHistory = [...menuHistory];
    newHistory.splice(index, 1);
    setMenuHistory(newHistory);
    localStorage.setItem("menuHistory", JSON.stringify(newHistory));
  };
  const [menu] = useState<MenuData[]>([
    {
      title: "메모",
      children: [
        {
          title: "메모",
          path: "/memoPage",
        },
        {
          title: "메모 등록",
          path: "/memoEditPage",
        },
      ],
    },
    {
      title: "일정",
      children: [
        {
          title: "일정",
          path: "/todoPage",
        },
        {
          title: "일정 등록",
          path: "/todoEditPage",
        },
      ],
    },
    {
      title: "가계부",
      children: [
        {
          title: "가계부",
          path: "/budgetPage",
        },
        {
          title: "수입 기록",
          path: "/budgetEditPage",
          state: {
            type: "income",
          },
        },
        {
          title: "지출 기록",
          path: "/budgetEditPage",
          state: {
            type: "expense",
          },
        },
        {
          title: "카테고리 관리",
          requireLoggin: true,
          path: "/categoryListPage",
        },
        {
          title: "가계부 통계",
          path: "/budgetChartPage",
        },
        {
          title: "대출 계산기",
          path: "/loanPage",
        },
      ],
    },
    {
      title: "일기",
      children: [
        {
          title: "일기",
          path: "/diaryPage",
        },
        {
          title: "일기 등록",
          path: "/diaryEditPage",
        },
      ],
    },
    {
      title: "설정",
      children: [
        {
          title: "설정",
          path: "/settingsPage",
        },
      ],
    },
  ]);
  useEffect(() => {
    const history = localStorage.getItem("menuHistory");
    console.log(`history ${history}`);
    if (history) {
      setMenuHistory(JSON.parse(history));
    }
  }, []);
  // 검색 필터
  const filteredMenu = menu
    .map((item) => {
      const filteredChildren = item.children?.filter((child) =>
        child.title.includes(searchText)
      );
      return {
        ...item,
        children: filteredChildren,
      };
    })
    .filter(
      (item) =>
        item.title.includes(searchText) ||
        (item.children && item.children.length > 0)
    );
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <Flex vertical style={{ height: "100vh", width: "100%" }}>
      <Flex style={{ padding: "20px 0px" }} vertical>
        <SearchBar
          placeholder="메뉴명을 입력하세요."
          style={{
            margin: "0px 10px",
            fontSize: sizes.font.xlarge,
          }}
          onChange={setSearchText}
        />
        {menuHistory.length > 0 && (
          <Flex align="center" style={{ padding: "0px 10px" }}>
            <Label name="최근 메뉴" placeholder style={{ flex: 1 }} />
            <Flex
              gap={5}
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                padding: "10px 0",
                scrollBehavior: "smooth",
                flex: 5,
              }}
              align="center"
              ref={scrollRef}
            >
              {menuHistory.map((menu, index) => {
                return (
                  <Flex
                    key={index}
                    style={{
                      fontSize: sizes.font.small,
                      backgroundColor: colors.lighterGray,
                      padding: 5,
                      borderRadius: 5,
                    }}
                    align="center"
                    gap={5}
                    onClick={() => {
                      handleMenuClick(menu);
                    }}
                  >
                    <Label name={menu.title} bold />
                    <AiOutlineDelete
                      style={{ fontSize: sizes.font.medium }}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMenuHistory(index);
                        if (scrollRef.current) {
                          scrollRef.current.scrollTo({
                            left: 0,
                            behavior: "smooth",
                          });
                        }
                      }}
                    />
                  </Flex>
                );
              })}
            </Flex>
          </Flex>
        )}

        {/* 메뉴 리스트 */}
        {filteredMenu.map((item, index) => {
          if (item.children && item.children.length > 0) {
            return (
              <List key={index} mode="card" header={item.title}>
                {item.children.map((child, childIndex) => (
                  <List.Item
                    key={childIndex}
                    onClick={() => {
                      handleMenuClick(child);
                    }}
                  >
                    {child.title}
                  </List.Item>
                ))}
              </List>
            );
          } else {
            return (
              <List.Item
                key={index}
                onClick={() => {
                  handleMenuClick(item);
                }}
              >
                {item.title}
              </List.Item>
            );
          }
        })}
      </Flex>
    </Flex>
  );
};
export default MenuPage;
