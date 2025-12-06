

import React from "react";
import { InputField } from "@/components/course/InputField";
import { Mail, Lock } from "lucide-react";
import { LoginFormData } from "@/app/auth/login/types";

export interface LoginFormFieldsProps {
  formData: LoginFormData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof LoginFormData
  ) => void;
  isLoading?: boolean;
}

export const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  formData,
  onInputChange,
  isLoading = false,
}) => {
  return (
    <>
      <InputField
        type="email"
        placeholder="Sử dụng email / số điện thoại"
        value={formData.email}
        onChange={(e) => onInputChange(e, "email")}
        icon={<Mail size={20} className="text-gray-400" />}
        required
        disabled={isLoading}
      />

      <InputField
        type="password"
        placeholder="Nhập mật khẩu"
        value={formData.password}
        onChange={(e) => onInputChange(e, "password")}
        icon={<Lock size={20} className="text-gray-400" />}
        required
        disabled={isLoading}
      />
    </>
  );
};
