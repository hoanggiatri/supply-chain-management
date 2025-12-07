import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

export function Combobox({
    options = [],
    value,
    onChange,
    placeholder = "Chọn...",
    error,
    helperText,
    disabled
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

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

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => !disabled && setOpen(!open)}
                disabled={disabled}
                className={`w-full flex items-center justify-between px-3 py-2 border rounded-md bg-white text-sm
          ${error ? "border-red-500" : "border-gray-300"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}
        `}
                style={{ height: 41 }}
            >
                <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </button>

            {error && helperText && (
                <p className="mt-1 text-xs text-red-500">{helperText}</p>
            )}

            {open && !disabled && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                        <div className="p-2 border-b sticky top-0 bg-white">
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        <div className="p-1">
                            {filteredOptions.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-gray-500">Không tìm thấy kết quả</div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleSelect(option)}
                                        className="w-full flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                    >
                                        <Check
                                            className={`mr-2 h-4 w-4 ${(selectedOption?.value === option.value) ? "opacity-100" : "opacity-0"
                                                }`}
                                        />
                                        {option.label}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Combobox;
