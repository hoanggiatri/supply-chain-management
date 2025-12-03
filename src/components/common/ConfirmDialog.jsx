import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

/**
 * Confirmation Dialog Component
 * Beautiful confirmation dialogs with icons and colors
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "warning", // warning, danger, success, info
  loading = false,
}) => {
  const configs = {
    warning: {
      icon: ExclamationTriangleIcon,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
      confirmColor: "amber",
    },
    danger: {
      icon: XCircleIcon,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
      confirmColor: "red",
    },
    success: {
      icon: CheckCircleIcon,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
      confirmColor: "green",
    },
    info: {
      icon: InformationCircleIcon,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      confirmColor: "blue",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  const handleConfirm = async () => {
    await onConfirm();  // xử lý logic
    onClose();          // đóng dialog
  };

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="sm"
    >
      <DialogHeader className="justify-center">
        <div className={`p-4 rounded-full ${config.iconBg} mb-2`}>
          <Icon className={`h-12 w-12 ${config.iconColor}`} />
        </div>
      </DialogHeader>
      <DialogBody className="text-center px-8">
        <Typography variant="h5" color="blue-gray" className="mb-3 font-bold">
          {title}
        </Typography>
        <Typography variant="paragraph" color="gray" className="font-normal">
          {message}
        </Typography>
      </DialogBody>
      <DialogFooter className="justify-center gap-3 pb-6">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={handleConfirm}
          disabled={loading}
          className="min-w-[100px]"
        >
          {cancelText}
        </Button>
        <Button
          color={config.confirmColor}
          onClick={handleConfirm}
          disabled={loading}
          className="min-w-[100px]"
        >
          {loading ? "Đang xử lý..." : confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmDialog;
