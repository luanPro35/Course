"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthLayout } from "@/components/auth/AuthLayout";
import LoginForm from "./login/LoginForm";
import RegisterForm from "./register/RegisterForm";

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

  useEffect(() => {
    setCurrentView(initialView);
  }, [initialView]);

  if (!isOpen) return null;

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AuthLayout onClose={onClose}>
      <AnimatePresence mode="wait">
        {currentView === "login" ? (
          <motion.div
            key="login"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <LoginForm
              onClose={onClose}
              onSwitchToRegister={() => setCurrentView("register")}
            />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <RegisterForm
              onClose={onClose}
              onSwitchToLogin={() => setCurrentView("login")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default AuthModal;
