import React, { useState } from "react";
import { InputField } from "@/components/course/InputField";
import { Mail, Lock } from "lucide-react";
import { SocialButton } from "./SocialButton";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import SuccessAnimation from "@/components/ui/SuccessAnimation";
import ErrorAnimation from "@/components/ui/ErrorAnimation";
import { useRouter } from "next/navigation";
// import { toast } from "react-toastify"; // Removed toast import
// import "react-toastify/dist/ReactToastify.css"; // Removed toast CSS import

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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          router.push("/dashboard"); // Redirect to dashboard or desired page
        }, 2000);
      } else {
        await response.json();
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
        }, 2000);
      }
    } catch {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // TODO: Add your social login logic here
    onClose();
  };

  return (
    <AuthLayout onClose={onClose}>
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <p>Đang đăng nhập...</p>
        </div>
      )}

      {isSuccess && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
          <SuccessAnimation onComplete={() => setIsSuccess(false)} />
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
          <ErrorAnimation
            mess="Đăng nhập thất bại!"
            onComplete={() => setIsError(false)}
          />
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-center mb-1">Đăng nhập</h2>
        <p className="text-center text-gray-500 mb-6">
          Truy cập vào hệ sinh thái học tập và phát triển
          <br />
          kỹ năng lập trình hàng đầu Việt Nam
        </p>
      </div>

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
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>

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

      <div className="mt-8 pt-6 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với{" "}
          <Link href="/terms" className="text-orange-500 hover:underline">
            điều khoản sử dụng
          </Link>{" "}
          của chúng tôi.
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
