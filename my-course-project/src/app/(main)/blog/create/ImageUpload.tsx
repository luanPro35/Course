import React from "react";
import { Image } from "lucide-react";

interface ImageUploadProps {
  image: string;
  imagePreview: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  image,
  imagePreview,
  onChange,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  return (
    <div className="mb-6">
      <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
        <Image className="w-5 h-5 text-gray-600" alt="" />
        Chọn ảnh đại diện <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-all cursor-pointer"
        >
          <div className="text-center">
            <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" alt="" />
            <span className="text-gray-600">
              {image ? "Đổi ảnh khác" : "Click để chọn ảnh"}
            </span>
            {image && <p className="text-sm text-gray-600 mt-1">{image}</p>}
          </div>
        </label>
      </div>
      {imagePreview && (
        <div className="mt-3 rounded-lg overflow-hidden border border-gray-300">
          <Image
            src={imagePreview}
            alt="Preview"
            className="w-full h-40 object-cover"
          />
        </div>
      )}
    </div>
  );
};
