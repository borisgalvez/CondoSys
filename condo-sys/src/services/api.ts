import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
let isRefreshing = false;
let failedRequestsQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}> = [];
let logoutFunction: () => void;
export const setLogoutFunction = (logoutFn: () => void) => {
  logoutFunction = logoutFn;
};
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.url?.includes('/login')) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (newToken: string) => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            },
            reject: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) throw new Error("No refresh token available");
        const refreshApi = axios.create({
          baseURL: import.meta.env.VITE_API_URL,
        });
        const refreshResponse = await refreshApi.post('/auth/refresh/', {
          refresh: refreshToken
        });
        const { access } = refreshResponse.data;
        localStorage.setItem("token", access);
        failedRequestsQueue.forEach(({ resolve }) => resolve(access));
        failedRequestsQueue = [];
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);
        failedRequestsQueue.forEach(({ reject }) => reject(refreshError as AxiosError));
        failedRequestsQueue = [];
        if (logoutFunction) {
          logoutFunction();
        }
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
