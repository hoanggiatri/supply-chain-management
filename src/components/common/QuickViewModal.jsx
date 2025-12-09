import React, { useEffect } from "react";

const QuickViewModal = ({ open, onClose, title, icon, children }) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative bg-white dark:bg-neutral-900
          rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.25)]
          max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto
          animate-scaleIn
          border border-gray-200 dark:border-neutral-700
        "
      >
        {/* Header */}
        <div
          className="
          sticky top-0 backdrop-blur-lg
          bg-white/80 dark:bg-neutral-900/80
          border-b border-gray-200 dark:border-neutral-700
          px-6 py-4 rounded-t-2xl z-10
        "
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
              {icon && <span className="text-2xl">{icon}</span>}
              {title}
            </h2>

            <button
              onClick={onClose}
              className="
                p-2 rounded-lg
                text-gray-600 hover:text-gray-900
                dark:text-gray-300 dark:hover:text-white
                hover:bg-gray-200 dark:hover:bg-neutral-800
                transition-all
              "
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

export default QuickViewModal;
