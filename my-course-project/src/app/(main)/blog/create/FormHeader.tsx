import React from "react";
import { BookOpen, Eye } from "lucide-react";

interface FormHeaderProps {
  title: string;
  subtitle: string;
  variant?: "form" | "preview";
}

export const FormHeader = ({
  title,
  subtitle,
  variant = "form",
}: FormHeaderProps) => {
  const Icon = variant === "form" ? BookOpen : Eye;
  const bgColor = variant === "form" ? "bg-gray-800" : "bg-gray-700";

  return (
    <div className={`${bgColor} px-8 py-6`}>
      <div className="flex items-center gap-3">
        <Icon className="w-8 h-8 text-white" />
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <p className="text-gray-300 mt-2">{subtitle}</p>
    </div>
  );
};
