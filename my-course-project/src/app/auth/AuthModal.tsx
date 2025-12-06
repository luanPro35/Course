"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthLayout } from "@/components/auth/AuthLayout";
import LoginForm from "./login/LoginForm";
import RegisterForm from "./register/RegisterForm";
import ForgotPasswordForm from "./login/ForgotPasswordForm";
import ResetPasswordForm from "./login/ResetPasswordForm";

type AuthView = "login" | "register" | "forgot" | "reset";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "register";
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialView = "login",
}) => {
  const [currentView, setCurrentView] = useState<AuthView>(initialView);
  const [resetEmail, setResetEmail] = useState("");

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
        {currentView === "login" && (
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
              onSwitchToForgot={() => setCurrentView("forgot")}
            />
          </motion.div>
        )}
        {currentView === "register" && (
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
        {currentView === "forgot" && (
          <motion.div
            key="forgot"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <ForgotPasswordForm
              onSwitchToLogin={() => setCurrentView("login")}
              onSwitchToReset={(email) => {
                setResetEmail(email);
                setCurrentView("reset");
              }}
            />
          </motion.div>
        )}
        {currentView === "reset" && (
          <motion.div
            key="reset"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <ResetPasswordForm
              email={resetEmail}
              onSwitchToLogin={() => setCurrentView("login")}
              onSwitchToForgot={() => setCurrentView("forgot")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default AuthModal;
