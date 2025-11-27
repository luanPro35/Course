

import React from "react";
import { InputField } from "@/components/course/InputField";
import { User, Mail, Phone, Lock } from "lucide-react";
import { RegisterFormData } from "@/app/auth/register/type";

interface RegisterFormFieldsProps {
  formData: RegisterFormData;
  onInputChange: (field: keyof RegisterFormData, value: string) => void;
  isLoading?: boolean;
}

export const RegisterFormFields: React.FC<RegisterFormFieldsProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <>
      <InputField
        type="text"
        placeholder="Họ và tên"
        value={formData.name}
        onChange={(e) => onInputChange("name", e.target.value)}
        icon={<User size={20} className="text-gray-400" />}
        required
      />

      <InputField
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => onInputChange("email", e.target.value)}
        icon={<Mail size={20} className="text-gray-400" />}
        required
      />

      <InputField
        type="tel"
        placeholder="Số điện thoại"
        value={formData.phone}
        onChange={(e) => onInputChange("phone", e.target.value)}
        icon={<Phone size={20} className="text-gray-400" />}
        required
      />

      <InputField
        type="password"
        placeholder="Mật khẩu"
        value={formData.password || ""}
        onChange={(e) => onInputChange("password", e.target.value)}
        icon={<Lock size={20} className="text-gray-400" />}
        required
      />

      <InputField
        type="password"
        placeholder="Xác nhận mật khẩu"
        value={formData.confirmPassword || ""}
        onChange={(e) => onInputChange("confirmPassword", e.target.value)}
        icon={<Lock size={20} className="text-gray-400" />}
        required
      />
    </>
  );
};
