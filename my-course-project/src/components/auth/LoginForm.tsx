import React, { useState } from "react";
import { InputField } from "@/components/course/InputField";
import { Mail, Lock } from "lucide-react";
import { SocialButton } from "@/app/auth/SocialButton";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onClose,
  onSwitchToRegister,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleInputChange =
    (field: keyof LoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose(); // Close modal after submission
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    onClose(); // Close modal after social login attempt
  };

  return (
    <div className="p-8">
      {/* Logo và tiêu đề */}
      <div className="text-center mb-8">
        <div className="w-32 h-32 bg-gradient-to-r flex items-center justify-center text-white text-2xl font-bold mx-auto">
          <Image src="/images/Brand.png" alt="logo" width={100} height={50} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Đăng ký tài khoản LearnX
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Truy cập vào hệ sinh thái học tập và phát triển
          <br />
          kỹ năng lập trình hàng đầu Việt Nam
        </p>
      </div>

      {/* Form đăng nhập */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <InputField
          type="email"
          placeholder="Sử dụng email / số điện thoại"
          value={formData.email}
          onChange={handleInputChange("email")}
          icon={<Mail size={20} className="text-gray-400" />}
          required
        />

        <InputField
          type="password"
          placeholder="Nhập mật khẩu"
          value={formData.password}
          onChange={handleInputChange("password")}
          icon={<Lock size={20} className="text-gray-400" />}
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium"
        >
          Đăng nhập
        </button>
      </form>

      {/* Đăng nhập mạng xã hội */}
      <div className="space-y-3 mb-6">
        <SocialButton
          icon={<FaGoogle />}
          text="Đăng nhập với Google"
          onClick={() => handleSocialLogin("google")}
        />

        <SocialButton
          icon={<FaFacebook />}
          text="Đăng nhập với Facebook"
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
  );
};

export default LoginForm;
