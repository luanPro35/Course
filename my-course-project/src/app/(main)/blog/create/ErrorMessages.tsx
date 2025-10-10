import React from "react";

interface ErrorMessagesProps {
  errors: Record<string, string | undefined>;
}

export const ErrorMessages = ({ errors }: ErrorMessagesProps) => {
  if (Object.keys(errors).length === 0) return null;

  return (
    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <h3 className="text-sm font-semibold text-red-800 mb-2">
        Vui lòng kiểm tra lại:
      </h3>
      <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
        {Object.values(errors).map((error, i) => (
          <li key={i}>{error}</li>
        ))}
      </ul>
    </div>
  );
};
