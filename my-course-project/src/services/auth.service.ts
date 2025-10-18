import { RegisterFormData, RegisterResponse } from "@/app/auth/register/type";
import { LoginFormData, LoginResponse } from "@/app/auth/login/types";

export class AuthService {
  // Register method
  static async register(formData: RegisterFormData): Promise<RegisterResponse> {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data: RegisterResponse;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        throw new Error("Đăng ký thất bại: Phản hồi không hợp lệ từ máy chủ.");
      }

      if (!res.ok) {
        throw new Error(data.mess || "Có lỗi xảy ra");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Đăng ký thất bại, thử lại sau!");
    }
  }

  // Login method
  static async login(formData: LoginFormData): Promise<LoginResponse> {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data: LoginResponse;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        throw new Error(
          "Đăng nhập thất bại: Phản hồi không hợp lệ từ máy chủ."
        );
      }

      if (!res.ok) {
        throw new Error(data.mess || "Email hoặc mật khẩu không đúng!");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Đăng nhập thất bại, thử lại sau!");
    }
  }

  // Social login/register
  static async loginWithSocial(provider: "google" | "facebook"): Promise<void> {
    // TODO: Implement social login logic
    console.log(`Login with ${provider}`);
  }
}
