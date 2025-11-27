

import { RegisterFormData } from "@/app/auth/register/type";

export const validateRegisterForm = (
  formData: RegisterFormData
): { isValid: boolean; message?: string } => {
  
  if (!formData.password || !formData.confirmPassword) {
    return {
      isValid: false,
      message: "Mật khẩu và xác nhận mật khẩu không được để trống!",
    };
  }

  
  if (formData.password !== formData.confirmPassword) {
    return {
      isValid: false,
      message: "Mật khẩu và xác nhận mật khẩu không khớp!",
    };
  }

  
  if (formData.password.length < 6) {
    return {
      isValid: false,
      message: "Mật khẩu phải có ít nhất 6 ký tự!",
    };
  }

  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return {
      isValid: false,
      message: "Email không hợp lệ!",
    };
  }

  
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
  if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
    return {
      isValid: false,
      message: "Số điện thoại không hợp lệ!",
    };
  }

  return { isValid: true };
};
