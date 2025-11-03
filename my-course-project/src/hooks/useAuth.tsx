"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types/user";
import { getTokens, removeTokens, setTokens } from "@/utils/token";
import {AuthService} from "@/services/auth.service";
// Removed getUserById as login logic will be updated to use email/password fetch
// import { getUserById } from "@/services/user.service";

interface AuthContextType {
  user: User | null;
  token: string | null; // This will hold the accessToken
  loading: boolean;
  login: (
    userData: User,
    accessToken: string,
    refreshToken: string
  ) => Promise<void>; // Updated login signature to accept data
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Added setUser
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // This will be the accessToken
  const [loading, setLoading] = useState(true);

  // Hàm login mới: chỉ cập nhật state và localStorage từ dữ liệu có sẵn
  const login = async (
    userData: User,
    accessToken: string,
    refreshToken: string
  ) => {
    setUser(userData);
    setToken(accessToken); // Set accessToken to context
    localStorage.setItem("user", JSON.stringify(userData));
    // Use utility functions to store both tokens
    setTokens(accessToken, refreshToken);
  };

  // Logout logic from AuthContent.tsx
  const logout = async () => {
    try {
      // Gọi đến AuthService để thông báo cho backend
      await AuthService.logout();
    } catch (error) {
      console.error("Failed to logout from server:", error);
    } finally {
      // Dù API có lỗi hay không, vẫn dọn dẹp ở FE để đảm bảo người dùng được đăng xuất
      setUser(null);
      setToken(null);
      removeTokens();
      localStorage.removeItem("user");
    }
  };

  // useEffect for restoring user from localStorage from AuthContent.tsx
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    // Use utility function to get accessToken
    const { accessToken: savedToken } = getTokens();

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        // Xóa dữ liệu không hợp lệ để tránh lỗi lặp lại
        logout();
      }
    }

    setLoading(false);
  }, []);

  const value = { user, token, loading, login, logout, setUser }; // Updated value

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
