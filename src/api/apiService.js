/**
 * API 서비스 모듈
 * 백엔드 API와의 통신을 담당합니다.
 */
import axios from "axios";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Hello API 호출
 * @returns {Promise<Object>} - Hello 메시지
 */
export const getHello = async () => {
  try {
    const response = await api.get("/hello");
    return response.data;
  } catch (error) {
    console.error("Error fetching hello:", error);
    throw error;
  }
};

export default {
  getHello,
};

// 위도 경도 넘겨서 주변 주차장 불러오기
export const fetchNearbyParkingLots = async (lat, lng) => {
  try {
    const response = await fetch("/api/parking-lots/nearby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      }),
    });

    if (!response.ok) throw new Error("서버 응답 실패");

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("주차장 조회 중 오류 발생:", err);
    throw err;
  }
};
