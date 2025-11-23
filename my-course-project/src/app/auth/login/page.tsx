"use client";

import React from "react";
import LoginForm from "./LoginForm";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  return (
    <LoginForm
      onClose={() => router.push("/")}
      onSwitchToRegister={() => router.push("/auth/register")}
    />
  );
};

export default LoginPage;
