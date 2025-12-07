export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = "Xác nhận",
    message = "Bạn có chắc chắn muốn thực hiện hành động này không?",
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    confirmButtonProps = "primary",
    cancelButtonProps = "outlinedSecondary"
}) {
    if (!open) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const getButtonClass = (type) => {
        const classes = {
            primary: "bg-blue-600 text-white hover:bg-blue-700",
            danger: "bg-red-600 text-white hover:bg-red-700",
            outlinedSecondary: "border border-gray-300 text-gray-700 hover:bg-gray-50",
        };
        return classes[type] || classes.primary;
    };

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
            <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white rounded-lg shadow-lg">
                    <div className="border-b p-6">
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-700">{message}</p>
                    </div>
                    <div className="border-t p-4 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className={`px-4 py-2 rounded-md transition-colors ${getButtonClass(cancelButtonProps)}`}
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`px-4 py-2 rounded-md transition-colors ${getButtonClass(confirmButtonProps)}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ConfirmDialog;
