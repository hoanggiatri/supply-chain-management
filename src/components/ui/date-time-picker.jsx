import { cn } from "@/lib/utils";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

// Vietnamese month names
const MONTHS_VI = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
];

// Vietnamese day names
const DAYS_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

// Generate years range
const generateYears = (start, end) => {
  const years = [];
  for (let i = start; i <= end; i++) {
    years.push(i);
  }
  return years;
};

// Generate hours
const generateHours = () => Array.from({ length: 24 }, (_, i) => i);

// Generate minutes (0, 5, 10, ... 55 or full 0-59)
const generateMinutes = (step = 1) => {
  const minutes = [];
  for (let i = 0; i < 60; i += step) {
    minutes.push(i);
  }
  return minutes;
};

// Get days in month
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Get first day of month (0 = Sunday)
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

const DateTimePicker = React.forwardRef(({
  value,
  onChange,
  placeholder = "Chọn ngày giờ",
  disabled = false,
  className,
  showTime = true,
  minYear = 2020,
  maxYear = 2030,
  minuteStep = 5,
  error = false,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const now = value ? new Date(value) : new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    if (value) {
      const d = new Date(value);
      return {
        year: d.getFullYear(),
        month: d.getMonth(),
        day: d.getDate(),
        hour: d.getHours(),
        minute: d.getMinutes()
      };
    }
    return null;
  });
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, openAbove: false });
  
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const years = generateYears(minYear, maxYear);
  const hours = generateHours();
  const minutes = generateMinutes(minuteStep);

  // Calculate dropdown position
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 450; // Approximate max height of dropdown
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    
    // Open above if not enough space below and more space above
    const openAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
    
    setDropdownPosition({
      top: openAbove ? triggerRect.top : triggerRect.bottom + 4,
      left: triggerRect.left,
      width: triggerRect.width,
      openAbove
    });
  }, []);

  // Recalculate position on open and scroll/resize
  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition, true);
      window.addEventListener('resize', calculatePosition);
      return () => {
        window.removeEventListener('scroll', calculatePosition, true);
        window.removeEventListener('resize', calculatePosition);
      };
    }
  }, [isOpen, calculatePosition]);

  // Update selectedDate when value prop changes
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      setSelectedDate({
        year: d.getFullYear(),
        month: d.getMonth(),
        day: d.getDate(),
        hour: d.getHours(),
        minute: d.getMinutes()
      });
      setViewDate({ year: d.getFullYear(), month: d.getMonth() });
    }
  }, [value]);

  // Format display value
  const formatDisplayValue = () => {
    if (!selectedDate) return "";
    const { year, month, day, hour, minute } = selectedDate;
    const dateStr = `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}/${year}`;
    if (showTime) {
      return `${dateStr} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    }
    return dateStr;
  };

  // Handle date selection
  const handleDayClick = (day) => {
    const newDate = {
      year: viewDate.year,
      month: viewDate.month,
      day,
      hour: selectedDate?.hour ?? 0,
      minute: selectedDate?.minute ?? 0
    };
    setSelectedDate(newDate);
    emitChange(newDate);
  };

  // Handle time change
  const handleTimeChange = (type, val) => {
    if (!selectedDate) return;
    const newDate = { ...selectedDate, [type]: parseInt(val) };
    setSelectedDate(newDate);
    emitChange(newDate);
  };

  // Emit change event
  const emitChange = (dateObj) => {
    if (onChange) {
      const { year, month, day, hour, minute } = dateObj;
      const isoString = new Date(year, month, day, hour, minute).toISOString();
      onChange({
        target: {
          name: props.name,
          value: isoString,
          type: "datetime"
        }
      });
    }
  };

  // Navigate months
  const prevMonth = () => {
    setViewDate((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  };

  const nextMonth = () => {
    setViewDate((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
    const firstDay = getFirstDayOfMonth(viewDate.year, viewDate.month);
    const days = [];

    // Empty slots before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="relative" ref={ref}>
      {/* Input trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
          className
        )}
        {...props}
      >
        <span className={selectedDate ? "text-gray-900" : "text-gray-400"}>
          {formatDisplayValue() || placeholder}
        </span>
        <Calendar className="h-4 w-4 text-gray-400" />
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Picker container - Fixed position */}
          <div 
            ref={dropdownRef}
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[320px]"
            style={{
              top: dropdownPosition.openAbove ? 'auto' : dropdownPosition.top,
              bottom: dropdownPosition.openAbove ? `${window.innerHeight - dropdownPosition.top + 4}px` : 'auto',
              left: dropdownPosition.left,
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Header: Month/Year navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex gap-2">
                {/* Month picker */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMonthPicker(!showMonthPicker);
                    setShowYearPicker(false);
                  }}
                  className="px-2 py-1 hover:bg-gray-100 rounded font-medium"
                >
                  {MONTHS_VI[viewDate.month]}
                </button>

                {/* Year picker */}
                <button
                  type="button"
                  onClick={() => {
                    setShowYearPicker(!showYearPicker);
                    setShowMonthPicker(false);
                  }}
                  className="px-2 py-1 hover:bg-gray-100 rounded font-medium"
                >
                  {viewDate.year}
                </button>
              </div>

              <button
                type="button"
                onClick={nextMonth}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Month picker dropdown */}
            {showMonthPicker && (
              <div className="grid grid-cols-3 gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
                {MONTHS_VI.map((month, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setViewDate((prev) => ({ ...prev, month: idx }));
                      setShowMonthPicker(false);
                    }}
                    className={cn(
                      "px-2 py-1.5 text-sm rounded hover:bg-indigo-100",
                      viewDate.month === idx && "bg-indigo-500 text-white hover:bg-indigo-600"
                    )}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}

            {/* Year picker dropdown */}
            {showYearPicker && (
              <div className="grid grid-cols-4 gap-2 mb-4 p-2 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      setViewDate((prev) => ({ ...prev, year }));
                      setShowYearPicker(false);
                    }}
                    className={cn(
                      "px-2 py-1.5 text-sm rounded hover:bg-indigo-100",
                      viewDate.year === year && "bg-indigo-500 text-white hover:bg-indigo-600"
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}

            {/* Calendar grid */}
            {!showMonthPicker && !showYearPicker && (
              <>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS_VI.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500 py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, idx) => (
                    <div key={idx} className="aspect-square">
                      {day && (
                        <button
                          type="button"
                          onClick={() => handleDayClick(day)}
                          className={cn(
                            "w-full h-full flex items-center justify-center text-sm rounded-lg hover:bg-indigo-100 transition-colors",
                            selectedDate?.day === day &&
                              selectedDate?.month === viewDate.month &&
                              selectedDate?.year === viewDate.year &&
                              "bg-indigo-500 text-white hover:bg-indigo-600"
                          )}
                        >
                          {day}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Time picker */}
            {showTime && selectedDate && !showMonthPicker && !showYearPicker && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Giờ:</span>
                  
                  {/* Hour select */}
                  <select
                    value={selectedDate.hour}
                    onChange={(e) => handleTimeChange("hour", e.target.value)}
                    className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {String(h).padStart(2, "0")}
                      </option>
                    ))}
                  </select>

                  <span className="text-gray-400">:</span>

                  {/* Minute select */}
                  <select
                    value={selectedDate.minute}
                    onChange={(e) => handleTimeChange("minute", e.target.value)}
                    className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {minutes.map((m) => (
                      <option key={m} value={m}>
                        {String(m).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Footer actions */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const newDate = {
                    year: now.getFullYear(),
                    month: now.getMonth(),
                    day: now.getDate(),
                    hour: now.getHours(),
                    minute: now.getMinutes()
                  };
                  setSelectedDate(newDate);
                  setViewDate({ year: now.getFullYear(), month: now.getMonth() });
                  emitChange(newDate);
                }}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Hôm nay
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Xong
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

DateTimePicker.displayName = "DateTimePicker";

export { DateTimePicker };
