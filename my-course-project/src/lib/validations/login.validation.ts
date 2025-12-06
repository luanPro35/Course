

import { LoginFormData } from "@/app/auth/login/types";

export const validateLoginForm = (
  formData: LoginFormData
): { isValid: boolean; message?: string } => {
  
  if (!formData.email.trim()) {
    return {
      isValid: false,
      message: "Vui lòng nhập email hoặc số điện thoại!",
    };
  }

  
  if (!formData.password.trim()) {
    return {
      isValid: false,
      message: "Vui lòng nhập mật khẩu!",
    };
  }

  
  if (formData.password.length < 8) {
    return {
      isValid: false,
      message: "Mật khẩu phải có ít nhất 8 ký tự!",
    };
  }

  
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
