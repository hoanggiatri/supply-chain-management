import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export const ImageUpload = ({
  previewUrl,
  onFileChange,
  inputId = "image-upload-input",
  label = "Chọn ảnh",
  helpText = "Định dạng: JPG, PNG. Tối đa 5MB.",
  className = "",
  imageClassName = "object-cover",
  containerClassName = "aspect-square w-full rounded-md",
  placeholderImage = "https://cdn-icons-png.freepik.com/512/2774/2774806.png",
  children,
}) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div
        className={`${containerClassName} overflow-hidden border border-gray-100 bg-gray-50 relative group`}
      >
        <img
          src={previewUrl || placeholderImage}
          alt="Preview"
          className={`w-full h-full ${imageClassName}`}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById(inputId)?.click()}
            className="bg-white/90 hover:bg-white text-gray-900"
          >
            <Upload className="w-4 h-4 mr-2" />
            {label}
          </Button>
        </div>
      </div>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />
      {helpText && (
        <p className="text-center text-xs text-gray-500">{helpText}</p>
      )}
      {children}
    </div>
  );
};

export default ImageUpload;
