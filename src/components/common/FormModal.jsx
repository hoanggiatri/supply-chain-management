import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const FormModal = ({
  open,
  onClose,
  onSubmit,
  title = "Form",
  icon = "✏️",
  children,
  loading = false,
  submitText = "Lưu",
  cancelText = "Hủy",
  size = "md",
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading && onSubmit) {
      onSubmit();
    }
  };

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
      <form onSubmit={handleSubmit}>
        <DialogHeader className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <span className="text-2xl">{icon}</span>
            </div>
            <Typography variant="h5" className="text-gray-900 font-bold">
              {title}
            </Typography>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <DialogBody divider className="py-6 max-h-[60vh] overflow-y-auto">
          {children}
        </DialogBody>

        <DialogFooter className="border-t border-gray-100 pt-4 gap-2">
          {loading && (
            <div className="flex items-center gap-2 mr-auto text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Đang xử lý...</span>
            </div>
          )}
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="gap-2"
          >
            {cancelText}
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={loading}
            className="gap-2 bg-blue-600 hover:bg-blue-700 min-w-[100px]"
          >
            {submitText}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

FormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  title: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
  loading: PropTypes.bool,
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
};

export default FormModal;
