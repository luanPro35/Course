import React from "react";

interface SocialButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  text,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium text-gray-700"
    >
      <span className="text-xl">{icon}</span>
      <span>{text}</span>
    </button>
  );
};
