import React from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
interface AvatarFieldProps {
  avatar: string;
  onClick: () => void;
}

export function AvatarField({ avatar, onClick }: AvatarFieldProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-white border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="text-sm font-medium text-gray-900">Ảnh đại diện</div>
        {avatar ? (
          <Image
            src={avatar}
            alt="Avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>
  );
}
