// components/AuthLayout.tsx
import React from "react";
import { X } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden max-h-[90vh]">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X size={24} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};
