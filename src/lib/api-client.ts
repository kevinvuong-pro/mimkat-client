import axios from 'axios';

import {
  RefreshQueue,
  getCurrentPath,
  redirectToLogin,
  isRefreshEndpoint,
} from './api-client-helpers';
import { getDeviceHeaders } from './device-info';
import { setTokens, clearTokens, getAccessToken, getRefreshToken } from './auth-token-storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

let isRefreshing = false;
const refreshQueue = new RefreshQueue();

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});
apiClient.interceptors.request.use(async (config) => {
  const accessToken = getAccessToken();

  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  Object.assign(config.headers, await getDeviceHeaders());

  return config;
});
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const currentPath = getCurrentPath();

    if (error.response?.status === 403) {
      redirectToLogin(currentPath);

      return Promise.reject(error);
    }

    if (!originalRequest._retry && error.response?.status === 401) {
      if (isRefreshEndpoint(originalRequest.url)) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.add({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw error;

        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh`,
          { refreshToken },
          { headers: await getDeviceHeaders() },
        );
        const tokens = refreshResponse.data.data;
        setTokens(tokens.accessToken, tokens.refreshToken);

        refreshQueue.resolve();

        return apiClient(originalRequest);
      } catch (refreshError) {
        clearTokens();
        refreshQueue.reject(refreshError);
        redirectToLogin(currentPath);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export { apiClient };
