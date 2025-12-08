import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import { X } from "lucide-react";

const InfoModal = ({
  open,
  onClose,
  title = "Thông tin",
  icon = "📋",
  children,
  footer,
  size = "md",
}) => {
  const sizeMap = {
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
  };

  return (
    <Dialog
      open={open}
      handler={onClose}
      size={sizeMap[size]}
      className="shadow-2xl rounded-xl"
      animate={{
        mount: { scale: 1, opacity: 1 },
        unmount: { scale: 0.9, opacity: 0 },
      }}
    >
      <DialogHeader className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <span className="text-2xl">{icon}</span>
          </div>
          <Typography variant="h5" className="text-gray-900 font-bold">
            {title}
          </Typography>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </DialogHeader>

      <DialogBody divider className="py-6 max-h-[60vh] overflow-y-auto">
        {children}
      </DialogBody>

      {footer && (
        <DialogFooter className="border-t border-gray-100 pt-4">
          {footer}
        </DialogFooter>
      )}
    </Dialog>
  );
};

InfoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
  footer: PropTypes.node,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
};

export default InfoModal;
