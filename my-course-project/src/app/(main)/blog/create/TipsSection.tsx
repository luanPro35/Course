import React from "react";

interface TipsSectionProps {
  tips: string[];
}

export const TipsSection = ({ tips }: TipsSectionProps) => {
  return (
    <div className="mt-6 bg-gray-100 rounded-lg p-6">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-xl">💡</span> Mẹo viết bài hiệu quả
      </h3>
      <ul className="space-y-2 text-gray-600 text-sm">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
