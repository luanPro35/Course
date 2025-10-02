import React, { useEffect } from "react";
import { X } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  onClose,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative my-8">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};
