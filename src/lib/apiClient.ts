"use client";

import axios from "axios";

const apiClient = axios.create({
  baseURL: typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")
    : "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // 5 seconds — faster fallback to local data
});

// Auth token injection
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("voxai_current_user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        config.headers["X-User-Email"] = parsed.email;
      } catch {
        // silent
      }
    }
  }
  return config;
});

// Silent error handling — never expose raw network errors to console
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Silently reject — calling services handle fallback gracefully
    return Promise.reject(error);
  }
);

export default apiClient;
