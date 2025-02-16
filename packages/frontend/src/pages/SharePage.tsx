import { useEffect } from "react";
import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";

const SharePage = () => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {}, [user]);
  return (
    <div>
      <h1>SharePage</h1>
    </div>
  );
};

export default SharePage;

// 아침을 시작하는 메시지
// 1.	“침대를 정리하는 순간, 하루의 첫 번째 승리를 거둔 거예요!”
// 2.	“작은 정리 하나가 큰 변화를 만듭니다. 오늘도 깔끔한 시작, 멋진 하루 되세요!”
// 3.	“공간을 정리하면 마음도 정리됩니다. 오늘도 가볍고 기분 좋은 하루 보내세요!”
// 4.	“아침을 정리하는 건 하루를 디자인하는 것과 같아요. 원하는 하루를 만들어보세요!”
// 5.	“오늘 하루도 당신의 의지로 시작됩니다. 작은 습관이 큰 변화를 만들어요!”

// 🌙 하루를 마무리하는 메시지
// 1.	“하루가 어땠든, 오늘도 최선을 다했어요. 이제 푹 쉬세요!”
// 2.	“정리된 공간처럼, 오늘의 고민도 정리하고 편안한 밤 보내세요.”
// 3.	“하루를 정리하며 내일을 준비하는 당신, 정말 멋져요!”
// 4.	“좋은 하루를 보냈다면 축하하고, 힘든 하루였다면 스스로를 다독이며 마무리하세요.”
// 5.	“고생한 나에게 수고했다고 한마디 건네고, 편안한 밤 보내세요!”
