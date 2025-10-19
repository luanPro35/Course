// components/auth/register/useRegisterForm.ts

import { useState } from "react";
import toast from "react-hot-toast";
import { RegisterFormData } from "./type";
import { validateRegisterForm } from "@/lib/validations/auth.validation";
import { AuthService } from "@/services/auth.service";

export const useRegisterForm = (onSuccess: () => void) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "", // Khớp với kiểu dữ liệu mới
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showErrorAnimation, setShowErrorAnimation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev: RegisterFormData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      toast.error(validation.message!);
      setErrorMessage(validation.message!);
      setShowErrorAnimation(true);
      return;
    }

    setIsLoading(true);

    try {
      // Loại bỏ đoạn mã chuyển đổi không cần thiết
      // Dữ liệu đã ở đúng định dạng
      const data = await AuthService.register(formData);
      if (data.success) {
        toast.success(data.mess || "Đăng ký thành công");
        setShowSuccessAnimation(true);
      } else {
        toast.error(data.mess || "Đăng ký thất bại");
        setErrorMessage(data.mess || "Đăng ký thất bại");
        setShowErrorAnimation(true);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Đăng ký thất bại, thử lại sau!";
      console.error("Registration error:", error);
      toast.error(message);
      setErrorMessage(message);
      setShowErrorAnimation(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = async (provider: "google" | "facebook") => {
    try {
      await AuthService.loginWithSocial(provider);
      onSuccess();
    } catch (error) {
      console.error("Social register error:", error);
      toast.error("Đăng ký bằng mạng xã hội thất bại!");
    }
  };

  const handleAnimationComplete = () => {
    setShowSuccessAnimation(false);
    onSuccess();
  };

  const handleErrorAnimationComplete = () => {
    setShowErrorAnimation(false);
  };

  return {
    formData,
    showSuccessAnimation,
    showErrorAnimation,
    errorMessage,
    isLoading,
    handleInputChange,
    handleSubmit,
    handleSocialRegister,
    handleAnimationComplete,
    handleErrorAnimationComplete,
  };
};
