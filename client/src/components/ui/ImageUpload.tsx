import React from "react";
import { LuImagePlus } from "react-icons/lu";

interface ImageUploadProps {
  label?: string;
  inputId: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl?: string | null;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label = "Resim yüklemek için tıklayın",
  inputId,
  onChange,
  previewUrl,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ürün Görseli
      </label>

      <div className="flex items-center gap-4">
        <label
          htmlFor={inputId}
          className="flex flex-col items-center justify-center w-full max-w-xs h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors duration-200 bg-gray-50"
        >
          <input
            type="file"
            id={inputId}
            className="hidden"
            accept="image/*"
            onChange={onChange}
          />
          <span className="flex items-center gap-2 text-sm text-gray-500">
            <LuImagePlus size={20} />
            {label}
          </span>
        </label>

        {previewUrl && (
          <div className="relative w-28 h-28 rounded overflow-hidden border shadow-sm">
            <img
              src={previewUrl}
              alt="Yüklenen görsel"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
