// components/auth/login/useLoginForm.ts

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginFormData } from "@/app/auth/login/types";
import { validateLoginForm } from "@/lib/validations/login.validation";
import { AuthService } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
export const useLoginForm = (onClose: () => void) => {
  const router = useRouter();
  const { login, user } = useAuth();

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
      return;
    }

    setIsLoading(true);

    try {
      // 1. Gọi AuthService.login để lấy dữ liệu từ backend
      // Hàm này đã gọi đến /api/login và trả về { user, accessToken, refreshToken }
      const data = await AuthService.login(formData);

      // 2. Gọi hàm login từ useAuth context để cập nhật state toàn cục
      // và lưu trữ tokens vào localStorage
      await login(data.user, data.accessToken, data.refreshToken);

      // Đăng nh��p thành công, đặt trạng thái thành công và tắt trạng thái lỗi
      setIsSuccess(true);
      setIsError(false); // Đảm bảo không hiển thị lỗi

      // Redirect after success animation - use response data to determine route
      setTimeout(() => {
        onClose();
        // Use the response data to determine redirect path
        if (data.user?.role === "admin") {
          console.log("Redirecting to admin page");
          router.push("/admin");
        } else {
          console.log("Redirecting to home page");
          router.push("/");
        }
        // Tải lại trang để đảm bảo các Server Component được cập nhật
        router.refresh();
      }, 1500);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Đăng nhập thất bại, thử lại sau!";
      console.error("Login error:", error);
      setErrorMessage(message);
      setIsError(true);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => {
    setIsError(false);
    setErrorMessage("");
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      await AuthService.loginWithSocial(provider);
      onClose();
    } catch (error) {
      console.error("Social login error:", error);
      setErrorMessage("Đăng nhập bằng mạng xã hội thất bại!");
      setIsError(true);
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
    resetError,
  };
};
