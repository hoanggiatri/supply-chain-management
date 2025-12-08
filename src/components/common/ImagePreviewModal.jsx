import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogBody, Typography } from "@material-tailwind/react";
import { X, Download, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ImagePreviewModal = ({
  open,
  onClose,
  imageUrl,
  imageName = "Image",
  imageSize,
  images = [], // Array of {url, name, size} for navigation
  currentIndex = 0,
  onNavigate,
}) => {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = imageName;
    link.click();
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handlePrevious = () => {
    if (onNavigate && currentIndex > 0) {
      onNavigate(currentIndex - 1);
      setZoom(1);
    }
  };

  const handleNext = () => {
    if (onNavigate && currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
      setZoom(1);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <Dialog
      open={open}
      handler={onClose}
      size={isFullscreen ? "xxl" : "xl"}
      className="shadow-2xl rounded-xl bg-gray-900"
      animate={{
        mount: { scale: 1, opacity: 1 },
        unmount: { scale: 0.9, opacity: 0 },
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={handleZoomOut}
            className="text-white hover:bg-gray-700 p-2 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-white text-sm font-medium">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="text-white hover:bg-gray-700 p-2 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleReset}
            className="text-white hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors text-sm"
            title="Reset Zoom"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="text-white hover:bg-gray-700 p-2 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="text-white hover:bg-gray-700 p-2 rounded-lg transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="text-white hover:bg-gray-700 p-2 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image Display */}
      <DialogBody
        className="p-0 bg-gray-900 flex items-center justify-center overflow-hidden"
        style={{ maxHeight: "80vh" }}
      >
        <div className="relative w-full h-full flex items-center justify-center p-6">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={imageName}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            />
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              {currentIndex > 0 && (
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                >
                  <span className="text-2xl">←</span>
                </button>
              )}
              {currentIndex < images.length - 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                >
                  <span className="text-2xl">→</span>
                </button>
              )}
            </>
          )}
        </div>
      </DialogBody>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-gray-700 bg-gray-800">
        <div>
          <Typography className="text-white font-medium">
            {imageName}
          </Typography>
          {imageSize && (
            <Typography className="text-gray-400 text-sm">
              Size: {formatFileSize(imageSize)}
            </Typography>
          )}
        </div>
        {images.length > 1 && (
          <Typography className="text-gray-400 text-sm">
            {currentIndex + 1} / {images.length}
          </Typography>
        )}
      </div>
    </Dialog>
  );
};

ImagePreviewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  imageUrl: PropTypes.string,
  imageName: PropTypes.string,
  imageSize: PropTypes.number,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string,
      size: PropTypes.number,
    })
  ),
  currentIndex: PropTypes.number,
  onNavigate: PropTypes.func,
};

export default ImagePreviewModal;
