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



interface AuthContextType {
  user: User | null;
  token: string | null; 
  loading: boolean;
  login: (
    userData: User,
    accessToken: string,
    refreshToken: string
  ) => Promise<void>; 
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); 
  const [loading, setLoading] = useState(true);

  
  const login = async (
    userData: User,
    accessToken: string,
    refreshToken: string
  ) => {
    console.log("Login function called with user:", userData);
    setTokens(accessToken, refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setToken(accessToken); 
    
    console.log("User state updated in AuthContext");
  };

  
  const logout = async () => {
    try {
      
      await AuthService.logout();
    } catch (error) {
      console.error("Failed to logout from server:", error);
    } finally {
      
      setUser(null);
      setToken(null);
      removeTokens();
      localStorage.removeItem("user");
    }
  };

  
  useEffect(() => {
    console.log("AuthProvider: Loading user from localStorage...");
    const savedUser = localStorage.getItem("user");
    
    const { accessToken: savedToken } = getTokens();

    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log("AuthProvider: User loaded from localStorage:", parsedUser);
        setUser(parsedUser);
        setToken(savedToken);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        
        logout();
      }
    } else {
      console.log("AuthProvider: No saved user or token found");
    }

    setLoading(false);
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
