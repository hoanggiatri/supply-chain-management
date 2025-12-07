export function StatusSummaryCard({
    data = [],
    statusLabels = [],
    getStatus,
    statusColors = {},
    onSelectStatus,
    selectedStatus,
}) {
    const items = Array.isArray(data) ? data : [];
    const countByStatus = statusLabels.reduce((count, label) => {
        count[label] =
            label === "Tất cả"
                ? items.length
                : items.filter((item) => getStatus(item) === label).length;
        return count;
    }, {});

    const getColorClasses = (color, isSelected) => {
        const colorMap = {
            "#000": { bg: "bg-gray-900", border: "border-gray-900", text: "text-gray-900" },
            "#9c27b0": { bg: "bg-purple-600", border: "border-purple-600", text: "text-purple-600" },
            "#ff9800": { bg: "bg-orange-500", border: "border-orange-500", text: "text-orange-500" },
            "#f44336": { bg: "bg-red-500", border: "border-red-500", text: "text-red-500" },
            "#2196f3": { bg: "bg-blue-500", border: "border-blue-500", text: "text-blue-500" },
            "#00bcd4": { bg: "bg-cyan-500", border: "border-cyan-500", text: "text-cyan-500" },
            "#4caf50": { bg: "bg-green-500", border: "border-green-500", text: "text-green-500" },
        };

        const classes = colorMap[color] || { bg: "bg-gray-500", border: "border-gray-500", text: "text-gray-500" };

        if (isSelected) {
            return `bg-white ${classes.border} ${classes.text} border-2 hover:bg-white`;
        }
        return `${classes.bg} ${classes.border} text-white border-2 hover:shadow-lg`;
    };

    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {statusLabels.map((label) => {
                const isSelected = label === selectedStatus;
                const colorClasses = getColorClasses(statusColors[label], isSelected);

                return (
                    <button
                        key={label}
                        onClick={() => onSelectStatus?.(label)}
                        className={`h-12 px-4 rounded-lg transition-all duration-200 ${colorClasses}`}
                    >
                        <div className="flex justify-between items-center w-full gap-3">
                            <span className="font-bold text-base">{label}</span>
                            <span className="font-bold text-base">{countByStatus[label] || 0}</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

export default StatusSummaryCard;
