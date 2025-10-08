import React from "react";
import { LucideIcon } from "lucide-react";

interface FormSelectProps {
  label: string;
  icon: LucideIcon;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  icon: Icon,
  required = false,
  value,
  onChange,
  options,
  placeholder = "Chọn một tùy chọn",
}) => {
  return (
    <div className="mb-6">
      <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
        <Icon className="w-5 h-5 text-gray-600" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all outline-none bg-white"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
