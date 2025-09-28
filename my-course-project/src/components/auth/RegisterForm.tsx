import React, { useState } from "react";
import { InputField } from "@/components/course/InputField";
import { User, Mail, Phone, Lock } from "lucide-react";
import { SocialButton } from "@/app/auth/SocialButton";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

interface RegisterFormData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onClose,
  onSwitchToLogin,
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const hanldeInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }
    console.log("Register Data:", formData);
    onClose(); // Close modal after submission
  };

  const handleSocialRegister = (provider: "google" | "facebook" | "github") => {
    console.log(`Register with ${provider}`);
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
          Tham gia cộng đồng học lập trình miễn phí
          <br />
          cùng hàng triệu người học khác
        </p>
      </div>

      {/* Form đăng ký */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <InputField
          type="text"
          placeholder="Họ và tên"
          value={formData.fullName}
          onChange={(e) => hanldeInputChange("fullName", e.target.value)}
          icon={<User size={20} className="text-gray-400" />}
          required
        />

        <InputField
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => hanldeInputChange("email", e.target.value)}
          icon={<Mail size={20} className="text-gray-400" />}
          required
        />

        <InputField
          type="tel"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={(e) => hanldeInputChange("phone", e.target.value)}
          icon={<Phone size={20} className="text-gray-400" />}
          required
        />

        <InputField
          type="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={(e) => hanldeInputChange("password", e.target.value)}
          icon={<Lock size={20} className="text-gray-400" />}
          required
        />

        <InputField
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={formData.confirmPassword}
          onChange={(e) => hanldeInputChange("confirmPassword", e.target.value)}
          icon={<Lock size={20} className="text-gray-400" />}
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium"
        >
          Đăng ký
        </button>
      </form>

      <div className="space-y-3 mb-6">
        <SocialButton
          icon={<FaGoogle />}
          text="Đăng nhập với Google"
          onClick={() => handleSocialRegister("google")}
        />

        <SocialButton
          icon={<FaFacebook />}
          text="Đăng nhập với Facebook"
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
          của F8.
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
