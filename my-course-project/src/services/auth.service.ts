import {RegisterFormData, RegisterResponse} from "@/app/auth/register/type";
import { signIn } from "next-auth/react";
import { LoginFormData, LoginResponse } from "@/app/auth/login/types";
import { getAccessToken } from "@/utils/token";


const register = async (
    formData: RegisterFormData
): Promise<RegisterResponse> => {
  // 1. Thay đổi điểm cuối (endpoint) API
  // Thay vì gọi trực tiếp tới 'http://localhost:8080/project/auth/register',
  // bây giờ chúng ta gọi tới API Route nội bộ '/api/register'.
  const response = await fetch(`/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // 2. Đơn giản hóa việc gửi dữ liệu
    // Chúng ta chỉ cần gửi thẳng `formData` từ form.
    // Việc ánh xạ sang định dạng của BE Java đã có API Route lo.
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  // 3. Xử lý phản hồi
  // Logic xử lý lỗi và thành công không thay đổi nhiều,
  // vì API Route đã được thiết kế để trả về định dạng mà FE mong đợi.
  if (!response.ok) {
    return { success: false, mess: data.mess || "Đăng ký thất bại" };
  }

  return { success: true, mess: "Đăng ký thành công!", data: data.result };
};

const login = async (formData: LoginFormData): Promise<LoginResponse> => {
  const response = await fetch(`/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    // Ném lỗi để custom hook (useLoginForm) có thể bắt và xử lý
    throw new Error(data.mess || "Đăng nhập thất bại");
  }
  return data;
};

const logout = async (): Promise<void> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    // Nếu không có accessToken trong localStorage, không cần gọi API
    return;
  }

  // Gọi đến API Route của Next.js
  await fetch(`/api/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ accessToken }),
  });
  // Chúng ta không cần xử lý response ở đây,
  // vì dù thành công hay thất bại, FE vẫn sẽ xóa token và đăng xuất người dùng.
};

const loginWithSocial = (provider: "google" | "facebook") => signIn(provider);

export const AuthService = { register, login, logout, loginWithSocial };