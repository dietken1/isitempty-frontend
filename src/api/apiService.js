/**
 * API 서비스 모듈
 * 백엔드 API와의 통신을 담당합니다.
 */
import axios from "axios";
import axiosInstance from "./axiosInstance";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: "/api/v1",
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
// 위도 경도 넘겨서 주변 카메라 불러오기
export const fetchNearbyCameras = async (latitude, longitude) => {
  const response = await fetch("/api/camera/nearby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ latitude, longitude }),
  });

  if (!response.ok) throw new Error("Failed to fetch nearby cameras");
  return response.json();
};
// 위도 경도 넘겨서 주변 화장실 불러오기
export const fetchNearbyToilets = async (latitude, longitude) => {
  try {
    const response = await fetch("/api/toilet/nearby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latitude, longitude }),
    });

    if (!response.ok) throw new Error("Failed to fetch nearby toilets");

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("화장실 조회 중 오류 발생:", err);
    throw err;
  }
};

export const loginUser = (userId, password) =>
  axiosInstance.post("/auth/login", { id: userId, password });

export const getUserMe = () => axiosInstance.get("/users/me");

export const getMyReviews = async () => {
  try {
    const response = await fetch("/api/myreviews");
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const getFavoriteParking = async () => {
  try {
    const response = await fetch("/api/favorites");
    if (!response.ok) {
      throw new Error("Failed to fetch favorites");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching favorite parking:", error);
    throw error;
  }
};

export const getUserDetails = (token) => {
  return fetch("/api/v1/users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      return response.json();
    })
    .then((data) => data)
    .catch((error) => {
      console.error("Error fetching user details:", error);
      throw error;
    });
};

export const updateUserDetails = (token, user) => {
  return fetch("/api/v1/users/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email: userUpdateData.email,
      password: userUpdateData.password,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: 사용자 정보 수정 실패`);
      }
      return response.json();
    })
    .then((data) => data)
    .catch((error) => {
      console.error("Error updating user details:", error);
      throw error;
    });
};

// 위도 경도 넘겨서 거리 포함 모든 주차장 불러오기 (거리 기준 정렬용)
export const fetchParkingLotsWithDistance = async (latitude, longitude) => {
  try {
    const response = await fetch("/api/parking-lots/all-with-distance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latitude, longitude }),
    });

    if (!response.ok) {
      throw new Error("주차장 거리 정보 불러오기 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching parking lots with distance:", error);
    throw error;
  }
};

export const sendContactMessage = (formData) => {
  return fetch("/api/question", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error submitting form:', error);
      throw error;
    });
};