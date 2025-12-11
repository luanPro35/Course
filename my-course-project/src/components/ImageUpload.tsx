"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Hình ảnh",
  required = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const previewUrl = URL.createObjectURL(file);
      onChange(previewUrl);
    } catch (err) {
      console.error("Error creating preview:", err);
      setError("Không thể tạo preview. Vui lòng thử lại.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
    setError(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {value ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/images/PostF8.png";
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1 truncate">{value}</p>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
              uploading
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-2" />
                <p className="text-sm text-blue-600 font-medium">
                  Đang tạo preview...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Click để chọn ảnh
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF (tối đa 5MB)
                </p>
              </div>
            )}
          </label>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <ImageIcon className="w-3 h-3" />
        <span>Hoặc bạn có thể dán URL ảnh vào ô bên dưới</span>
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com/image.jpg"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
    </div>
  );
}
