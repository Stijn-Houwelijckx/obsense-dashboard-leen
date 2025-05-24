import axios from "axios";
import { useAuthStorage } from "store/authStorage";
import { User } from "types/user.types";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// List of public routes that don't need authorization
const publicRoutes = ["/users/signup", "/users/login"];

// Add a request interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    // Skip token authorization for public routes
    if (publicRoutes.some((route) => config.url?.includes(route))) {
      return config;
    }

    const token = useAuthStorage.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // toevoegen aan header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  signup: async (
    userData: Omit<User, "confirmPassword" | "profilePicture" | "tokens">
  ) => {
    const response = await api.post("/users/signup", {
      user: userData,
    });
    return response.data;
  },

  login: async (userData: Pick<User, "email" | "password">) => {
    const response = await api.post("/users/login", { user: userData });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },
};

export default api;
