"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const vnp_TxnRef = searchParams.get("vnp_TxnRef");
    const vnp_Amount = searchParams.get("vnp_Amount");

    if (vnp_ResponseCode === "00") {
      setStatus("success");
      setMessage("Thanh toán thành công! Bạn đã được ghi danh vào khóa học.");

      setTimeout(() => {
        router.push("/");
      }, 3000);
    } else {
      setStatus("failed");

      const errorMessages: Record<string, string> = {
        "07": "Giao dịch bị nghi ngờ gian lận",
        "09": "Thẻ/Tài khoản chưa đăng ký dịch vụ",
        "10": "Thẻ/Tài khoản không đúng",
        "11": "Thẻ/Tài khoản hết hạn",
        "12": "Thẻ/Tài khoản bị khóa",
        "13": "Sai mật khẩu xác thực giao dịch",
        "24": "Giao dịch bị hủy",
        "51": "Tài khoản không đủ số dư",
        "65": "Tài khoản vượt quá hạn mức giao dịch",
        "75": "Ngân hàng thanh toán đang bảo trì",
        "79": "Giao dịch vượt quá số lần nhập sai mật khẩu",
        "99": "Lỗi không xác định",
      };

      setMessage(
        errorMessages[vnp_ResponseCode || "99"] ||
          "Thanh toán thất bại. Vui lòng thử lại."
      );
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {status === "loading" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Đang xử lý thanh toán...
            </h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Thanh toán thành công!
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                href="/my-courses"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Xem khóa học của tôi
              </Link>
              <Link
                href="/"
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Thanh toán thất bại
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={() => router.back()}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Thử lại
              </button>
              <Link
                href="/"
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
