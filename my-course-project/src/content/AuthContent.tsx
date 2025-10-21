"use client";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Giả lập API login bằng cách fetch từ db.json
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`http://localhost:3001/users?email=${email}`);
      const data = await res.json();

      if (data.length > 0) {
        const foundUser = data[0];
        setUser(foundUser);
        setToken(foundUser.token);
      } else {
        alert("Sai tài khoản hoặc mật khẩu");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  // ✅ Lấy thông tin user từ db.json khi khởi động app
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/users");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setToken(data.token);
        }
      } catch (error) {
        console.error("Lỗi khi lấy user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const value = { user, token, loading, login, logout, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
