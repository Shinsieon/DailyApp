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

// 경위도 -> 좌표 변환
export function dfs_xy_conv(v1: number, v2: number) {
  const RE = 6371.00877; // 지구 반경(km)
  const GRID = 5.0; // 격자 간격(km)
  const SLAT1 = 30.0; // 투영 위도1(degree)
  const SLAT2 = 60.0; // 투영 위도2(degree)
  const OLON = 126.0; // 기준점 경도(degree)
  const OLAT = 38.0; // 기준점 위도(degree)
  const XO = 43; // 기준점 X좌표(GRID)
  const YO = 136; // 기1준점 Y좌표(GRID)
  const DEGRAD = Math.PI / 180.0;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  let ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = v2 * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;
  return {
    nx: Math.floor(ra * Math.sin(theta) + XO + 0.5),
    ny: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5),
  };
}

export function generateLightColor() {
  const r = Math.floor(Math.random() * 76) + 180; // 180~255
  const g = Math.floor(Math.random() * 76) + 180; // 180~255
  const b = Math.floor(Math.random() * 76) + 180; // 180~255
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * PMT 함수: 일정한 이자율과 횟수로 원리금을 균등 상환할 때 매 기간 납부할 금액 계산
 *
 * @param {number} rate - 기간별 이자율 (예: 연 5%라면 0.05 / 12)
 * @param {number} nper - 총 상환 횟수 (예: 30년 * 12 = 360)
 * @param {number} pv - 현재 대출금 (현재 가치, 예: 100000000)
 * @param {number} fv - 미래가치 (보통 0, 대부분 대출은 이 값이 0)
 * @param {boolean} type - 선불 여부 (false = 후불, true = 선불)
 * @returns {number} - 매 기간 상환해야 할 금액 (음수로 반환)
 */
export function PMT(
  rate: number,
  nper: number,
  pv: number,
  fv = 0,
  type = false
) {
  if (rate === 0) return -(pv + fv) / nper;

  const pvif = Math.pow(1 + rate, nper);
  let pmt = (rate / (pvif - 1)) * -(pv * pvif + fv);

  if (type) {
    pmt /= 1 + rate;
  }

  return pmt;
}
