// components/auth/login/useLoginForm.ts

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginFormData } from "@/app/auth/login/types";
import { validateLoginForm } from "@/lib/validations/login.validation";
import { AuthService } from "@/services/auth.service";
import { useAuth } from "@/content/AuthContent";
export const useLoginForm = (onClose: () => void) => {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof LoginFormData
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(false);
    setIsSuccess(false);

    // Validate form
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrorMessage(validation.message!);
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
      return;
    }

    setIsLoading(true);

    try {
      const data = await AuthService.login(formData);
      login(data.token!, data.user!);
      setIsSuccess(true);

      // Redirect after success animation
      setTimeout(() => {
        onClose();
        if (data.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 1500);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Đăng nhập thất bại, thử lại sau!";
      console.error("Login error:", error);
      setErrorMessage(message);
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      await AuthService.loginWithSocial(provider);
      onClose();
    } catch (error) {
      console.error("Social login error:", error);
      setErrorMessage("Đăng nhập bằng mạng xã hội thất bại!");
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
    }
  };

  return {
    formData,
    isLoading,
    isSuccess,
    isError,
    errorMessage,
    handleInputChange,
    handleSubmit,
    handleSocialLogin,
  };
};
