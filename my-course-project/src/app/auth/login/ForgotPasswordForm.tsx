import React, { useState } from "react";
import { AuthService } from "@/services/auth.service";
import Link from "next/link";

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
  onSwitchToReset: (email: string) => void;
}

export default function ForgotPasswordForm({
  onSwitchToLogin,
  onSwitchToReset,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await AuthService.forgotPassword(email);
      setMessage(
        "Nếu email tồn tại, mã OTP đã được gửi. Vui lòng kiểm tra email của bạn."
      );
      setTimeout(() => {
        onSwitchToReset(email);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-1">Quên Mật Khẩu</h2>
        <p className="text-gray-500">
          Nhập email để nhận mã OTP khôi phục tài khoản
        </p>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="your@email.com"
          />
        </div>

        {message && (
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <p className="text-green-700 text-sm">{message}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
        >
          {loading ? "Đang gửi..." : "Gửi Mã OTP"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-orange-500 hover:text-orange-600 text-sm font-medium hover:underline"
        >
          ← Quay lại đăng nhập
        </button>
      </div>
    </div>
  );
}
