export function formatMoney(amount: number) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function translateToKorean(amount: number) {
  if (isNaN(amount)) {
    return "";
  }

  const units = ["", "만", "억", "조", "경"]; // 한국 단위
  const result = [];
  let unitIndex = 0;

  while (amount > 0) {
    const part = amount % 10000; // 4자리씩 끊어서 처리
    if (part > 0) {
      const formattedPart = part.toLocaleString(); // 천 단위 콤마 추가
      result.unshift(`${formattedPart}${units[unitIndex]}`);
    }
    amount = Math.floor(amount / 10000); // 10000으로 나누어 단위 이동
    unitIndex++;
  }

  return result.join(" ");
}

export function getRandomHexColor() {
  const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  return randomColor;
}

export function getRandomDarkHexColor() {
  const randomColor = "#" + Math.floor(Math.random() * 8388607).toString(16); // 0x7F7F7F까지 범위 설정
  return randomColor;
}
