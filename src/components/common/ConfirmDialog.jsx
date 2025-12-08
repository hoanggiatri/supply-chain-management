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
import { getButtonProps } from "@/utils/buttonStyles";
import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này không?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "default", // default, destructive, warning, info, success
  confirmButtonProps,
  cancelButtonProps = "outlinedSecondary",
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  // Get icon and colors based on variant
  const getVariantConfig = () => {
    switch (variant) {
      case "destructive":
        return {
          icon: <AlertCircle className="w-6 h-6 text-red-600" />,
          iconBg: "bg-red-100",
          headerColor: "text-red-900",
          button: confirmButtonProps || "destructive",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
          iconBg: "bg-amber-100",
          headerColor: "text-amber-900",
          button: confirmButtonProps || "warning",
        };
      case "info":
        return {
          icon: <Info className="w-6 h-6 text-blue-600" />,
          iconBg: "bg-blue-100",
          headerColor: "text-blue-900",
          button: confirmButtonProps || "primary",
        };
      case "success":
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          iconBg: "bg-green-100",
          headerColor: "text-green-900",
          button: confirmButtonProps || "success",
        };
      default:
        return {
          icon: <Info className="w-6 h-6 text-gray-600" />,
          iconBg: "bg-gray-100",
          headerColor: "text-gray-900",
          button: confirmButtonProps || "primary",
        };
    }
  };

  const config = getVariantConfig();

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="sm"
      className="shadow-xl"
      animate={{
        mount: { scale: 1, opacity: 1 },
        unmount: { scale: 0.9, opacity: 0 },
      }}
    >
      <DialogHeader className="flex items-center gap-3">
        <div className={`${config.iconBg} p-2 rounded-full`}>{config.icon}</div>
        <Typography variant="h5" className={config.headerColor}>
          {title}
        </Typography>
      </DialogHeader>
      <DialogBody divider className="py-6">
        <Typography className="text-gray-700 text-base">{message}</Typography>
      </DialogBody>
      <DialogFooter className="gap-2">
        <Button {...getButtonProps(cancelButtonProps)} onClick={onClose}>
          {cancelText}
        </Button>
        <Button {...getButtonProps(config.button)} onClick={handleConfirm}>
          {confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf([
    "default",
    "destructive",
    "warning",
    "info",
    "success",
  ]),
  confirmButtonProps: PropTypes.string,
  cancelButtonProps: PropTypes.string,
};

export default ConfirmDialog;
