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
      const { data, error } = await authClient.token();

      if (error) {
        console.error("JWT Error:", error);
      }

      if (data?.token) {
        config.headers.Authorization = `Bearer ${data.token}`;

        // Token পাওয়া গেছে, token নিজে console-এ print করবে না
        console.log("JWT attached to request ✅");
      } else {
        console.warn("JWT token unavailable ❌");
      }

      return config;
    } catch (error) {
      console.error("Token fetching failed:", error);
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
        error.response.data
      );
    }

    return Promise.reject(error);
  }
);

export default api;