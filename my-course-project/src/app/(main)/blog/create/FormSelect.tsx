import React, { ComponentType } from "react";

interface BaseProps {
  label: string;
  icon: ComponentType<{ className: string }>;
  required?: boolean;
}

type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> &
  BaseProps & {
    options: { value: string; label: string }[];
    placeholder: string;
  };

export const FormSelect = ({
  label,
  icon: Icon,
  required,
  options,
  placeholder,
  ...rest
}: FormSelectProps) => {
  return (
    <div className="mb-6">
      <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
        <Icon className="w-5 h-5 text-gray-600" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        {...rest}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all outline-none bg-white"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
