// components/SocialButton.tsx
import React from "react";

interface SocialButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  className?: string;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  text,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 ${className}`}
    >
      {icon}
      {text}
    </button>
  );
};
