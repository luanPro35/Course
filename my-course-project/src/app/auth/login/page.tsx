"use client";

import React, { useState } from "react";
import LoginForm from "./LoginForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [currentForm, setCurrentForm] = useState<"login" | "forgot" | "reset">(
    "login"
  );
  const [resetEmail, setResetEmail] = useState("");

  const handleSwitchToForgot = () => setCurrentForm("forgot");
  const handleSwitchToReset = (email: string) => {
    setResetEmail(email);
    setCurrentForm("reset");
  };
  const handleSwitchToLogin = () => setCurrentForm("login");

  return (
    <>
      {currentForm === "login" && (
        <AuthLayout onClose={() => router.push("/")}>
          <LoginForm
            onClose={() => router.push("/")}
            onSwitchToRegister={() => router.push("/auth/register")}
            onSwitchToForgot={handleSwitchToForgot}
          />
        </AuthLayout>
      )}
      {currentForm === "forgot" && (
        <AuthLayout onClose={() => router.push("/")}>
          <ForgotPasswordForm
            onSwitchToLogin={handleSwitchToLogin}
            onSwitchToReset={handleSwitchToReset}
          />
        </AuthLayout>
      )}
      {currentForm === "reset" && (
        <AuthLayout onClose={() => router.push("/")}>
          <ResetPasswordForm
            email={resetEmail}
            onSwitchToLogin={handleSwitchToLogin}
            onSwitchToForgot={handleSwitchToForgot}
          />
        </AuthLayout>
      )}
    </>
  );
};

export default LoginPage;
