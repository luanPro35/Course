// lib/validations/login.validation.ts

import { LoginFormData } from "@/app/auth/login/types";

export const validateLoginForm = (
  formData: LoginFormData
): { isValid: boolean; message?: string } => {
  // Check if email/phone is provided
  if (!formData.email.trim()) {
    return {
      isValid: false,
      message: "Vui lòng nhập email hoặc số điện thoại!",
    };
  }

  // Check if password is provided
  if (!formData.password.trim()) {
    return {
      isValid: false,
      message: "Vui lòng nhập mật khẩu!",
    };
  }

  // Check password length
  if (formData.password.length < 8) {
    return {
      isValid: false,
      message: "Mật khẩu phải có ít nhất 8 ký tự!",
    };
  }

  // Validate email or phone format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
  const cleanEmail = formData.email.replace(/\s/g, "");

  if (!emailRegex.test(cleanEmail) && !phoneRegex.test(cleanEmail)) {
    return {
      isValid: false,
      message: "Email hoặc số điện thoại không hợp lệ!",
    };
  }

  return { isValid: true };
};
