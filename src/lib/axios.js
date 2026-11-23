import axios from "axios";
import { authClient } from "./auth-client";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const { data } = await authClient.token();

      if (data?.token) {
        config.headers.Authorization = `Bearer ${data.token}`;
      }

      return config;
    } catch {
      // Not signed in — continue without an Authorization header.
      return config;
    }
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error(
        "API 401:",
        error.response.data?.message ||
          error.response.statusText ||
          "Unauthorized"
      );
    }

    return Promise.reject(error);
  }
);

export default api;