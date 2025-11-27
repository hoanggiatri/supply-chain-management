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

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này không?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  confirmButtonProps = "primary",
  cancelButtonProps = "outlinedSecondary",
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} handler={onClose} size="sm">
      <DialogHeader>
        <Typography variant="h5" color="blue-gray">
          {title}
        </Typography>
      </DialogHeader>
      <DialogBody divider>
        <Typography variant="paragraph" color="blue-gray">
          {message}
        </Typography>
      </DialogBody>
      <DialogFooter>
        <Button
          {...getButtonProps(cancelButtonProps)}
          onClick={onClose}
          className="mr-2"
        >
          {cancelText}
        </Button>
        <Button {...getButtonProps(confirmButtonProps)} onClick={handleConfirm}>
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
  confirmButtonProps: PropTypes.string,
  cancelButtonProps: PropTypes.string,
};

export default ConfirmDialog;
