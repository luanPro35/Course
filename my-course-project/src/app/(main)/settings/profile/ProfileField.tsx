import React from "react";
import { ChevronRight } from "lucide-react";

interface ProfileFieldProps {
  label: string;
  value: string;
  fieldName: string;
  placeholder?: string;
  onClick: (fieldName: string) => void;
}

export function ProfileField({
  label,
  value,
  fieldName,
  placeholder = "Chưa cập nhật",
  onClick,
}: ProfileFieldProps) {
  return (
    <div
      onClick={() => onClick(fieldName)}
      className="flex items-center justify-between p-4 bg-white border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-sm text-gray-500 mt-1">{value || placeholder}</div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>
  );
}
