export function formatMoney(amount: number) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getRandomHexColor() {
  const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  return randomColor;
}

export function getRandomDarkHexColor() {
  const randomColor = "#" + Math.floor(Math.random() * 8388607).toString(16); // 0x7F7F7F까지 범위 설정
  return randomColor;
}
