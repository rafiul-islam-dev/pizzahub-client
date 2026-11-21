import axios from "axios";
import { authClient } from "./auth-client";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// Attach JWT token automatically
api.interceptors.request.use(async (config) => {
  const { data, error } = await authClient.token();

  if (!error && data?.token) {
    config.headers.Authorization = `Bearer ${data.token}`;
  }

  return config;
});

export default api;