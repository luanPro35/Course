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
    <div className="fixed inset-0 bg-black/50 flex justify-center p-4 z-[9999] overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative my-8 p-8">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-black transition-colors z-50"
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
