import { jwtDecode } from "jwt-decode";

import { useAuthStorage } from "../store/authStorage";

export const useAuthToken = () => {
  const { token } = useAuthStorage();
  const { clearAuth } = useAuthStorage();

  const getUserIdFromToken = (token: string | null) => {
    if (!token) return null;

    try {
      const decoded = jwtDecode<{ id: string }>(token);
      return decoded.id;
    } catch {
      clearAuth();
      return null;
    }
  };

  const userId = getUserIdFromToken(token);

  return {
    userId,
    token,
    isAuth: !!userId && !!token,
  };
};
