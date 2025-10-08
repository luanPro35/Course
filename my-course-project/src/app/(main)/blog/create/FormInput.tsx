import React from "react";
import { LucideIcon } from "lucide-react";

interface FormInputProps {
  label: string;
  icon: LucideIcon;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "textarea";
  rows?: number;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  icon: Icon,
  required = false,
  value,
  onChange,
  placeholder,
  type = "text",
  rows = 10,
}) => {
  const inputClasses =
    "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none";

  return (
    <div className="mb-6">
      <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
        <Icon className="w-5 h-5 text-indigo-600" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={`${inputClasses} resize-none`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};
