export function calculateFee(parking, time) {
  const basicTime = parseInt(parking.baseTime, 10) || 0;
  const basicFee = parseInt(parking.baseFee, 10) || 0;
  const unitTime = parseInt(parking.addTime, 10) || 1;
  const unitFee = parseInt(parking.addFee, 10) || 0;
  const dailyFee = parseInt(parking.dayTicketFee, 10) || 0;
  const feeInfo = parking.feeInfo;

  // 명시적으로 무료
  if (feeInfo?.includes("무료")) return "무료";

  // 요금 정보가 전혀 없을 경우
  const allFeesMissing = !basicFee && !unitFee && !dailyFee;
  if (allFeesMissing) return "요금정보 없음";

  // 24시간 이상이면 일일 요금 적용
  if (time >= 1440 && dailyFee !== 0) return `${dailyFee}원`;

  if (time <= basicTime) return `${basicFee}원`;

  const extraTime = time - basicTime;
  const extraUnits = unitTime > 0 ? Math.ceil(extraTime / unitTime) : 0;
  return `${basicFee + extraUnits * unitFee}원`;
}
