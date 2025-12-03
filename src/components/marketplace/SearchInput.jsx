import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@material-tailwind/react";

/**
 * SearchInput component with debounce
 */
const SearchInput = ({
  value = "",
  onChange,
  placeholder = "Tìm kiếm...",
  debounceMs = 300,
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange?.(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange]);

  // Sync with external value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback((e) => {
    setLocalValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setLocalValue("");
    onChange?.("");
  }, [onChange]);

  return (
    <div className="relative w-full max-w-md">
      <Input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        color="blue"
        className="!border-blue-gray-200 focus:!border-blue-500 pl-10"
        labelProps={{
          className: "hidden",
        }}
        containerProps={{
          className: "min-w-0",
        }}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5 text-blue-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        }
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-gray-400 hover:text-blue-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchInput;

