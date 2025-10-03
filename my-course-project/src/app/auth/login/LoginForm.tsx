import React from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import SuccessAnimation from "@/components/ui/SuccessAnimation";
import ErrorAnimation from "@/components/ui/ErrorAnimation";
import { SocialButton } from "../SocialButton";
import { LoginFormFields } from "@/app/auth/login/LoginFormFields";
import { useLoginForm } from "@/app/auth/login/useLoginForm";
import { LoginFormProps } from "@/app/auth/login/types";
import { LoginFormFieldsProps } from "@/app/auth/login/LoginFormFields";
import LoginAnimation from "@/components/ui/LoginAnimation";

const LoginForm: React.FC<LoginFormProps> = ({
  onClose,
  onSwitchToRegister,
}) => {
  const {
    formData,
    isLoading,
    isSuccess,
    isError,
    errorMessage,
    handleInputChange,
    handleSubmit,
    handleSocialLogin,
  } = useLoginForm(onClose);

  return (
    <AuthLayout onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left side - Form */}
        <div className="relative">
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <p className="text-gray-600 font-medium">Đang đăng nhập...</p>
            </div>
          )}

          {isSuccess && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
              <SuccessAnimation onComplete={() => {}} />
            </div>
          )}

          {isError && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
              <ErrorAnimation
                mess={errorMessage || "Đăng nhập thất bại!"}
                onComplete={() => {}}
              />
            </div>
          )}

          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-center mb-1">Đăng nhập</h2>
            <p className="text-center text-gray-500 mb-6">
              Truy cập vào hệ sinh thái học tập và phát triển
              <br />
              kỹ năng lập trình hàng đầu Việt Nam
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <LoginFormFields
              formData={formData}
              onInputChange={
                handleInputChange as LoginFormFieldsProps["onInputChange"]
              }
              isLoading={isLoading}
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <SocialButton
              icon={<FaGoogle />}
              text={"Đăng nhập với Google"}
              onClick={() => handleSocialLogin("google")}
            />

            <SocialButton
              icon={<FaFacebook />}
              text={"Đăng nhập với Facebook"}
              onClick={() => handleSocialLogin("facebook")}
            />
          </div>

          {/* Links */}
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-1 text-sm">
              <span className="text-gray-600">Chưa có tài khoản?</span>
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Đăng ký
              </button>
            </div>

            <Link
              href="/forgot-password"
              className="block text-orange-500 hover:text-orange-600 text-sm font-medium"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Terms */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với{" "}
              <Link href="/terms" className="text-orange-500 hover:underline">
                điều khoản sử dụng
              </Link>{" "}
              của chúng tôi.
            </p>
          </div>
        </div>

        {/* Right side - Animation */}
        <div className="block md:flex items-center justify-center h-full min-h-[400px] bg-gray-50 rounded-lg p-4">
          <LoginAnimation />
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
