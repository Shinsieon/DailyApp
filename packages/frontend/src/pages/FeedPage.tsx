import { Flex } from "antd";
import Label from "../components/Label";
import { colors } from "../colors";
import { useUserStore } from "../store/userStore";
import { useEffect, useState } from "react";
import { Feed, FeedCategory } from "../types";
import { api } from "../api";
import { Input, Tag } from "antd-mobile";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IoChatbubble, IoHeart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../components/UserAvatar";

dayjs.extend(relativeTime);

const mockFeed: Feed[] = [
  {
    id: 1,
    title: "좋아하는 노래",
    category: "음악" as FeedCategory,
    content:
      "이 노래 정말 좋아요! 제가 이 노래를 좋아하는 이유는요, 가사가 너무 감동적이에요. 그리고 멜로디도 정말 아름다워요.",
    user: {
      id: 1,
      name: "사용자1",
      profileImage: "https://example.com/image1.jpg",
    },
    createdAt: new Date().toISOString(),
    updatedAt: "2023-10-01T12:00:00Z",
    comments: [
      {
        id: 1,
        content: "저도 좋아해요!",
        user: {
          id: 2,
          name: "사용자2",
          profileImage: "https://example.com/image2.jpg",
        },
        createdAt: "2023-10-01T13:00:00Z",
        updatedAt: "2023-10-01T13:00:00Z",
        feedId: 1,
      },
    ],
    likes: [
      {
        id: 1,
        user: {
          id: 3,
          name: "사용자3",
          profileImage: "https://example.com/image3.jpg",
        },
        createdAt: "2023-10-01T14:00:00Z",
        updatedAt: "2023-10-01T14:00:00Z",
        feedId: 1,
      },
    ],
  },
  {
    id: 2,
    title: "좋아하는 책",
    category: "책" as FeedCategory,
    content:
      "이 책 정말 좋아요! 제가 이 책을 좋아하는 이유는요, 내용이 너무 흥미로워요. 그리고 글쓰기도 정말 매력적이에요.",
    user: {
      id: 1,
      name: "사용자1",
      profileImage: "https://example.com/image1.jpg",
    },
    createdAt: new Date().toISOString(),
    updatedAt: "2023-10-01T12:00:00Z",
    comments: [],
    likes: [],
  },
  {
    id: 3,
    title: "좋아하는 영화",
    category: "영화" as FeedCategory,
    content:
      "이 영화 정말 좋아요! 제가 이 영화를 좋아하는 이유는요, 스토리가 너무 감동적이에요. 그리고 연기도 정말 뛰어나요.",
    user: {
      id: 1,
      name: "사용자1",
      profileImage: "https://example.com/image1.jpg",
    },
    createdAt: new Date().toISOString(),
    updatedAt: "2023-10-01T12:00:00Z",
    comments: [],
    likes: [],
  },
];
mockFeed.push(mockFeed[0]);
mockFeed.push(mockFeed[1]);

const FeedItem = (feed: Feed) => {
  const { user } = useUserStore();
  const timeAgo = dayjs(feed.createdAt).fromNow();
  return (
    <Flex
      key={feed.id}
      gap={10}
      style={{
        borderTop: `1px solid ${colors.lightGray}`,
        padding: 10,
      }}
    >
      <Flex gap={10}>
        <Flex style={{ flex: 1 }}>
          <UserAvatar />
        </Flex>
        <Flex vertical style={{ flex: 8 }}>
          <Flex gap={10} align="center">
            <Label name={user!.nickname} style={{ fontWeight: "bold" }} />
            <Label name={timeAgo} placeholder />
            <Tag color="primary">{feed.category}</Tag>
          </Flex>
          <span>
            <Tag color="default">{"#" + feed.title}</Tag>{" "}
            <Label name={feed.content} maxLength={200} />
          </span>
          <Flex gap={10} align="center">
            <IoChatbubble />
            <Label name={`${feed.comments.length}`} placeholder />
            <IoHeart />
            <Label name={`${feed.likes.length}`} placeholder />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const FeedPage = () => {
  const { user } = useUserStore();
  const [feeds, setFeeds] = useState<Feed[]>(mockFeed);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await api.getFeed(user!.id);
        setFeeds(response);
      } catch (error) {
        console.error("Error fetching feeds:", error);
      }
    };
    fetchFeeds();
  });
  return (
    <Flex
      vertical
      style={{
        width: "100%",
        overflowY: "auto",
      }}
      gap={10}
    >
      <Flex
        gap={10}
        style={{
          borderTop: `1px solid ${colors.lightGray}`,
          padding: "10px",
        }}
      >
        <Flex style={{ flex: 1 }}>
          <UserAvatar />
        </Flex>
        <Flex vertical style={{ flex: 8 }}>
          <Flex
            vertical
            onClick={() => {
              console.log("click");
              navigate("/feedEditPage");
            }}
          >
            <Flex gap={10} align="center">
              <Label name={user!.nickname} style={{ fontWeight: "bold" }} />
            </Flex>
            <Input
              placeholder="나의 하루 중 어떤 이야기를 나누고 싶으신가요?"
              onClick={() => {
                navigate("/feedEditPage");
              }}
            />
            {/* <Flex align="center">
              <Label name="카테고리"></Label>
              <Button
                size="mini"
                fill="none"
                color="primary"
                onClick={() => setCategoryShow(true)}
              >
                {category}
                <FaCaretDown />
              </Button>
              <Cascader
                options={categoryOption}
                placeholder={categoryOption[0].label}
                visible={categoryShow}
                cancelText="취소"
                onCancel={() => setCategoryShow(false)}
                confirmText="확인"
                onConfirm={(value) => {
                  setCategory(value[0] as string);
                  setCategoryShow(false);
                }}
              />
            </Flex>*/}
          </Flex>
        </Flex>
      </Flex>

      <Flex vertical gap={10}>
        {feeds.map((feed) => (
          <FeedItem {...feed} />
        ))}
      </Flex>
    </Flex>
  );
};

export default FeedPage;
