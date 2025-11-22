"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import SuccessAnimation from "@/components/ui/SuccessAnimation";
import ErrorAnimation from "@/components/ui/ErrorAnimation";

const OAuth2CallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Đang xử lý đăng nhập Google...");

  const loginAttempted = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    console.log("OAuth2CallbackPage mounted. Code:", code, "Error:", error);

    if (loginAttempted.current) {
      console.log("Login already attempted, skipping.");
      return;
    }

    if (error) {
      console.error("OAuth error received:", error);
      setStatus("error");
      setMessage("Đăng nhập thất bại: " + error);
      loginAttempted.current = true;
      return;
    }

    if (!code) {
      console.error("No auth code found in URL");
      setStatus("error");
      setMessage("Không tìm thấy mã xác thực!");
      loginAttempted.current = true;
      return;
    }

    loginAttempted.current = true;

    const handleLogin = async () => {
      try {
        console.log("Calling AuthService.loginWithGoogle with code:", code);
        const data = await AuthService.loginWithGoogle(code);
        console.log("AuthService response:", data);

        await login(data.user, data.accessToken, data.refreshToken);
        setStatus("success");
        setMessage("Đăng nhập thành công!");

        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } catch (err: unknown) {
        console.error("Google login error details:", err);
        setStatus("error");
        let errorMessage = "Đăng nhập thất bại!";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        console.error("Final error message displayed:", errorMessage);
        setMessage(errorMessage);
      }
    };

    handleLogin();
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600 font-medium">{message}</p>
          </div>
        )}

        {status === "success" && (
          <SuccessAnimation mess={message} onComplete={() => {}} />
        )}

        {status === "error" && (
          <div className="space-y-4">
            <ErrorAnimation
              mess={message}
              onComplete={() => router.push("/auth/login")}
            />
            <button
              onClick={() => router.push("/auth/login")}
              className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Quay lại đăng nhập
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuth2CallbackPage;
