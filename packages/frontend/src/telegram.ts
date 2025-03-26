const TELEGRAM_TOKEN = "7550999790:AAHp-7L9w4kXu2G5CjUGaS87CqcuK5n06kg";
const TELEGRAM_CHAT_ID = "7316218092";

export const sendToTelegram = async (content: string) => {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: `[API ERROR]\n${content}`,
      }),
    });
  } catch (err) {
    console.error("텔레그램 전송 실패:", err);
  }
};
