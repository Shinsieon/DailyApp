import { useNavigate } from "react-router-dom";
import { colors } from "../colors";
import { useMemoStore } from "../store/memoStore";
import CardItem from "./CardItem";
import CustomCard from "./CustomCard";

const MemoCard = () => {
  const navigate = useNavigate();
  const memos = useMemoStore((state) => state.memos);
  return (
    <CustomCard
      title="메모"
      onAddClick={() => {
        navigate("memoEditPage");
      }}
      onClick={() => {
        navigate("memoPage");
      }}
      children={
        <>
          {memos
            .sort((a, b) => a.title.localeCompare(b.title, "ko-KR"))
            .map(
              (memo, index: number) =>
                index < 3 && (
                  <CardItem
                    key={memo.id}
                    title={memo.title}
                    description={memo.content}
                    backgroundColor={colors.lightGreen}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`memo clicked ${memo.id}`);
                      navigate("memoEditPage", { state: { memoId: memo.id } });
                    }}
                  />
                )
            )}
        </>
      }
    />
  );
};

export default MemoCard;
