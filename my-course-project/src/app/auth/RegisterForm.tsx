import React, { useState } from "react";
import { InputField } from "@/components/course/InputField";
import { User, Mail, Phone, Lock } from "lucide-react";
import { SocialButton } from "./SocialButton";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import toast from "react-hot-toast";

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

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.mess || "Có lỗi xảy ra");
        return;
      }
      toast.success(data.mess || "Đăng kí thành công");
      console.log("User:", data.user);
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Đăng ký thất bại, thử lại sau!");
    }
  };

  const handleSocialRegister = (provider: "google" | "facebook") => {
    console.log(`Register with ${provider}`);
    // TODO: Add your social register logic here
    onClose();
  };

  return (
    <AuthLayout onClose={onClose}>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-center mb-1">
          Đăng ký tài khoản
        </h2>
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
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          icon=<User size={20} className="text-gray-400" />
          required
        />

        <InputField
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          icon=<Mail size={20} className="text-gray-400" />
          required
        />

        <InputField
          type="tel"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          icon=<Phone size={20} className="text-gray-400" />
          required
        />

        <InputField
          type="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          icon=<Lock size={20} className="text-gray-400" />
          required
        />

        <InputField
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          icon=<Lock size={20} className="text-gray-400" />
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
          icon=<FaGoogle />
          text="Đăng ký với Google"
          onClick={() => handleSocialRegister("google")}
        />

        <SocialButton
          icon=<FaFacebook />
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
    </AuthLayout>
  );
};

export default RegisterForm;
