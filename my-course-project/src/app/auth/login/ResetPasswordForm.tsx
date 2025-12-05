import React, { useState } from "react";
import { AuthService } from "@/services/auth.service";

interface ResetPasswordFormProps {
  email: string;
  onSwitchToLogin: () => void;
  onSwitchToForgot: () => void;
}

export default function ResetPasswordForm({
  email: initialEmail,
  onSwitchToLogin,
  onSwitchToForgot,
}: ResetPasswordFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (otp.length !== 6) {
      setError("Mã OTP phải có 6 chữ số");
      return;
    }

    if (newPassword.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      await AuthService.resetPassword({
        email,
        otp,
        newPassword,
      });

      setMessage("Đổi mật khẩu thành công! Đang chuyển về trang đăng nhập...");

      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.message || "Có lỗi xảy ra";
      if (errorMessage.toLowerCase().includes("otp")) {
        setError("Mã OTP không đúng hoặc đã hết hạn. Vui lòng thử lại.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-1">Đặt Lại Mật Khẩu</h2>
        <p className="text-gray-500">Nhập mã OTP từ email của bạn</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mã OTP (6 chữ số)
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            required
            maxLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
            placeholder="000000"
          />
          <p className="text-xs text-gray-500 mt-1">
            Mã OTP có hiệu lực trong 10 phút
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu mới
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Ít nhất 8 ký tự"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Nhập lại mật khẩu"
          />
        </div>

        {message && (
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <p className="text-green-700 text-sm font-medium">{message}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
        >
          {loading ? "Đang xử lý..." : "Đổi Mật Khẩu"}
        </button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <button
          onClick={onSwitchToForgot}
          className="block w-full text-orange-500 hover:text-orange-600 text-sm font-medium hover:underline"
        >
          Gửi lại mã OTP
        </button>
        <button
          onClick={onSwitchToLogin}
          className="block w-full text-gray-600 hover:text-gray-700 text-sm hover:underline"
        >
          ← Quay lại đăng nhập
        </button>
      </div>
    </div>
  );
}
