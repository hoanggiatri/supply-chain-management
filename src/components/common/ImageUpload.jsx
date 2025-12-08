import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import toastrService from "@/services/toastrService";

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
  variant = "square", // square, circle, rectangle
  maxSize = 5, // MB
  onRemove,
  children,
}) => {
  const [dragActive, setDragActive] = useState(false);

  // Validate file size
  const validateFile = (file) => {
    const maxSizeInBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toastrService.error(`Kích thước file không được vượt quá ${maxSize}MB!`);
      return false;
    }
    return true;
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileChange(e);
    } else {
      e.target.value = ""; // Reset input
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/") && validateFile(file)) {
      // Create a synthetic event for onFileChange
      const syntheticEvent = {
        target: {
          files: [file],
        },
      };
      onFileChange(syntheticEvent);
    } else if (file && !file.type.startsWith("image/")) {
      toastrService.error("Vui lòng chọn file ảnh!");
    }
  };

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case "circle":
        return "rounded-full aspect-square";
      case "rectangle":
        return "rounded-md aspect-video";
      case "square":
      default:
        return "rounded-md aspect-square";
    }
  };

  const containerStyle = containerClassName || `w-full ${getVariantStyles()}`;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div
        className={`${containerStyle} overflow-hidden border-2 ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } bg-white relative group shadow-md hover:shadow-lg transition-all`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className={`w-full h-full ${imageClassName}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <ImageIcon className="w-16 h-16 text-gray-300" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => document.getElementById(inputId)?.click()}
            className="bg-white/90 hover:bg-white text-gray-900"
          >
            <Upload className="w-4 h-4 mr-2" />
            {label}
          </Button>
          {previewUrl && onRemove && (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={onRemove}
              className="bg-red-500/90 hover:bg-red-600 text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Drag & drop text */}
        {dragActive && (
          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
            <p className="text-blue-700 font-semibold">Thả file vào đây</p>
          </div>
        )}
      </div>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
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
