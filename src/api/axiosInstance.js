import axios from "axios";
import { TokenLocalStorageRepository } from "../repository/localstorages";
import { refreshToken } from "./refreshToken";

const instance = axios.create({
  baseURL: `/api/v1`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 토큰 삽입
instance.interceptors.request.use(
  (config) => {
    const token = TokenLocalStorageRepository.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 토큰 만료 시 갱신
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        TokenLocalStorageRepository.setToken({ token: newToken });
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest); // 재시도
      } catch (err) {
        console.error("토큰 갱신 실패:", err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
