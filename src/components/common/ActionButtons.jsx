import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, Save, Check, X } from "lucide-react";

export const EditButton = ({ onClick, label = "Sửa", className = "", ...props }) => (
    <Button
        type="button"
        variant="secondary"
        onClick={onClick}
        className={`bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium shadow-sm border-0 gap-2 ${className}`}
        {...props}
    >
        <Pencil className="w-4 h-4" />
        {label}
    </Button>
);

export const DeleteButton = ({ onClick, label = "Xóa", className = "", ...props }) => (
    <Button
        type="button"
        variant="destructive"
        onClick={onClick}
        className={`font-medium shadow-sm gap-2 ${className}`}
        {...props}
    >
        <Trash2 className="w-4 h-4" />
        {label}
    </Button>
);

export const AddButton = ({ onClick, label = "Thêm", className = "", ...props }) => (
    <Button
        type="button"
        variant="default"
        onClick={onClick}
        className={`font-medium shadow-sm gap-2 ${className}`}
        {...props}
    >
        <Plus className="w-4 h-4" />
        {label}
    </Button>
);

export const SaveButton = ({ onClick, label = "Lưu", className = "", ...props }) => (
    <Button
        type="button"
        onClick={onClick}
        className={`bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm gap-2 ${className}`}
        {...props}
    >
        <Save className="w-4 h-4" />
        {label}
    </Button>
);

export const ConfirmButton = ({ onClick, label = "Xác nhận", className = "", ...props }) => (
    <Button
        type="button"
        onClick={onClick}
        className={`bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm gap-2 ${className}`}
        {...props}
    >
        <Check className="w-4 h-4" />
        {label}
    </Button>
);

export const CancelButton = ({ onClick, label = "Hủy", className = "", ...props }) => (
    <Button
        type="button"
        variant="secondary"
        onClick={onClick}
        className={`bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium shadow-sm gap-2 ${className}`}
        {...props}
    >
        <X className="w-4 h-4" />
        {label}
    </Button>
);
