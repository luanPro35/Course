// components/auth/register/RegisterForm.tsx

import React from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import SuccessAnimation from "@/components/ui/SuccessAnimation";
import ErrorAnimation from "@/components/ui/ErrorAnimation";
import { SocialButton } from "../SocialButton";
import { RegisterFormFields } from "./RegisterFormFields";
import { useRegisterForm } from "./useRegisterForm";
import { RegisterFormProps } from "@/app/auth/register/type";
import RegisterAnimation from "@/components/ui/RegisterAnimation";

const RegisterForm: React.FC<RegisterFormProps> = ({
  onClose,
  onSwitchToLogin,
}) => {
  const {
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
  } = useRegisterForm(onClose);

  return (
    <AuthLayout onClose={onClose}>
      {showSuccessAnimation && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10 rounded-2xl">
          <SuccessAnimation onComplete={handleAnimationComplete} />
        </div>
      )}
      {showErrorAnimation && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10 rounded-2xl">
          <ErrorAnimation
            mess={errorMessage}
            onComplete={handleErrorAnimationComplete}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 items-center">
        {/* Left side - Form */}
        <div>
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-1">Đăng ký tài khoản</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Tham gia cộng đồng học lập trình miễn phí
              <br />
              cùng hàng triệu người học khác
            </p>
          </div>

          {/* Form đăng ký */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <RegisterFormFields
              formData={formData}
              onInputChange={handleInputChange}
              isLoading={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>

          {/* Social Register */}
          <div className="space-y-3 mb-6">
            <SocialButton
              icon={<FaGoogle />}
              text="Đăng ký với Google"
              onClick={() => handleSocialRegister("google")}
            />

            <SocialButton
              icon={<FaFacebook />}
              text="Đăng ký với Facebook"
              onClick={() => handleSocialRegister("facebook")}
            />
          </div>

          {/* Links */}
          <div className="text-center">
            <div className="flex justify-center space-x-1 text-sm">
              <span className="text-gray-600">Đã có tài khoản?</span>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Đăng nhập
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Bằng việc đăng ký, bạn đã đồng ý với{" "}
              <Link href="/terms" className="text-orange-500 hover:underline">
                Điều khoản dịch vụ
              </Link>{" "}
              và{" "}
              <Link href="/privacy" className="text-orange-500 hover:underline">
                Chính sách bảo mật
              </Link>{" "}
              của LearnX.
            </p>
          </div>
        </div>

        {/* Right side - Animation */}
        <div className="flex items-center justify-center h-full min-h-[400px] bg-gray-50 rounded-lg p-4">
          <RegisterAnimation />
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterForm;
