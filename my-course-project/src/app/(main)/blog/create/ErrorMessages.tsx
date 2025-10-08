import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorMessagesProps {
  errors: string[];
}

export const ErrorMessages: React.FC<ErrorMessagesProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-red-800 mb-2">
            Vui lòng kiểm tra lại:
          </h4>
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
