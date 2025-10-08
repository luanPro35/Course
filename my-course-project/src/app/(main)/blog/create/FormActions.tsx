import React from "react";

interface FormActionsProps {
  onDraft: () => void;
  onPublish: () => void;
  isSubmitting: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onDraft,
  onPublish,
  isSubmitting,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={onDraft}
        disabled={isSubmitting}
        className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Đang lưu..." : "Lưu bản nháp"}
      </button>
      <button
        onClick={onPublish}
        disabled={isSubmitting}
        className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Đang xuất bản..." : "Xuất bản ngay"}
      </button>
    </div>
  );
};
