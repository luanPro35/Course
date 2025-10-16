import React from "react";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function TabButton({
  active,
  onClick,
  children,
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-3xl transition-all duration-200 ${
        active
          ? "bg-blue-600 text-white font-semibold"
          : "bg-transparent border border-gray-300 text-gray-700 hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}
