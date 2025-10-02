"use client";
import React, { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type AuthView = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: AuthView;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialView = "login",
}) => {
  const [currentView, setCurrentView] = useState<AuthView>(initialView);

  if (!isOpen) return null;

  return (
    <AuthLayout onClose={onClose}>
      {currentView === "login" ? (
        <LoginForm
          onClose={onClose}
          onSwitchToRegister={() => setCurrentView("register")}
        />
      ) : (
        <RegisterForm
          onClose={onClose}
          onSwitchToLogin={() => setCurrentView("login")}
        />
      )}
    </AuthLayout>
  );
};

export default AuthModal;
