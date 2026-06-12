import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

// Auth token injection
apiClient.interceptors.request.use((config) => {

  if (typeof window !== "undefined") {

    const user =
      localStorage.getItem("voxai_auth_user");

    if (user) {

      try {

        const parsed = JSON.parse(user);

        config.headers["X-User-Email"] =
          parsed.email;

      } catch {

        // silent

      }
    }
  }

  return config;
});

// Silent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default apiClient;