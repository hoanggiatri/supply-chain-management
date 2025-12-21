import { motion } from "framer-motion";
import { Check, ChevronsUpDown } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Marketplace-v2 Combobox Component
 * A searchable select component styled to match mp-input design system
 * Uses React Portal for dropdown to avoid stacking context issues
 */
export function MpCombobox({
  options = [],
  value,
  onChange,
  placeholder = "Chọn...",
  error,
  helperText,
  disabled,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const buttonRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  // Calculate position function
  const calculatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 250;
      
      const showAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
      
      return {
        position: 'fixed',
        top: showAbove ? 'auto' : rect.bottom + 4,
        bottom: showAbove ? window.innerHeight - rect.top + 4 : 'auto',
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      };
    }
    return {};
  };

  // Use layoutEffect to calculate position before paint
  useLayoutEffect(() => {
    if (open) {
      setDropdownStyle(calculatePosition());
    }
  }, [open]);

  // Handle open - calculate position immediately
  const handleOpen = () => {
    if (!disabled) {
      const newStyle = calculatePosition();
      setDropdownStyle(newStyle);
      setOpen(!open);
    }
  };

  const filteredOptions = options.filter((option) =>
    (option.label || "").toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = typeof value === "object"
    ? value
    : options.find((opt) => opt.value === value);

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
    setSearch("");
  };

  const handleClose = () => {
    setOpen(false);
    setSearch("");
  };

  // Dropdown content - rendered via Portal
  const dropdownContent = open && !disabled && dropdownStyle.position && (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0" 
        style={{ zIndex: 9998 }}
        onClick={handleClose} 
      />
      
      {/* Dropdown Menu */}
      <div 
        style={{
          ...dropdownStyle,
          backgroundColor: 'var(--mp-bg-primary)',
          borderColor: 'var(--mp-border-color, rgba(0,0,0,0.1))',
        }}
        className="border rounded-xl shadow-lg max-h-60 overflow-auto"
      >
        <div 
          className="p-2 border-b sticky top-0" 
          style={{ backgroundColor: 'var(--mp-bg-primary)' }}
        >
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mp-input w-full"
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        </div>
        <div 
          className="p-1"
          style={{ backgroundColor: 'var(--mp-bg-primary)' }}
        >
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>
              Không tìm thấy kết quả
            </div>
          ) : (
            filteredOptions.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-start gap-2"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.1 }}
                title={option.label}
              >
                {value === option.value && (
                  <Check size={16} className="text-blue-500 flex-shrink-0" />
                )}
                <span 
                  className="flex-1 truncate text-left"
                  style={{ color: 'var(--mp-text-primary)' }}
                >
                  {option.label}
                </span>
              </motion.button>
            ))
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={`mp-input w-full flex items-center justify-between
          ${error ? "border-red-500" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span 
          className={`flex-1 truncate text-left ${selectedOption ? "" : "opacity-50"}`}
          title={selectedOption?.label}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronsUpDown className="h-4 w-4 opacity-50 flex-shrink-0 ml-2" />
      </button>

      {error && helperText && (
        <p className="text-red-500 text-xs mt-1">{helperText}</p>
      )}

      {/* Render dropdown via Portal to escape stacking context */}
      {createPortal(dropdownContent, document.body)}
    </div>
  );
}

export default MpCombobox;
