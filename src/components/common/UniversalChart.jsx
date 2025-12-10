import React, { useState } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const smoothPath = (points) => {
  if (points.length < 2) return "";

  let d = `M ${points[0].x},${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx = (prev.x + curr.x) / 2;

    d += ` C ${cx},${prev.y} ${cx},${curr.y} ${curr.x},${curr.y}`;
  }
  return d;
};

const UniversalChart = ({
  title = "",
  subtitle = "",
  data = [],
  dataKey = "value",
  xAxisKey = "label",
  height = 280,
  color = "#1D9BF0",
  className = "",
}) => {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card className="shadow-sm border rounded-xl h-[280px] flex items-center justify-center">
        <Typography color="gray" className="text-sm font-medium">
          Không có dữ liệu
        </Typography>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map((d) => d[dataKey] || 0));

  const padding = {
    top: 40,
    left: 80, // Increased from 50 to make room for Y-axis labels
    right: 40,
    bottom: 40,
  };

  const width = 1400; // Increased to 1400 for even longer horizontal spread
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const scaleX = (i) => padding.left + (i / (data.length - 1)) * chartW;
  const scaleY = (v) => padding.top + chartH - (v / maxValue) * chartH;

  const points = data.map((d, i) => ({
    x: scaleX(i),
    y: scaleY(d[dataKey] || 0),
    value: d[dataKey],
    label: d[xAxisKey],
  }));

  const path = smoothPath(points);

  return (
    <Card className={`shadow-sm border rounded-2xl ${className}`}>
      <CardBody className="p-6">
        {/* Title */}
        <div className="mb-4">
          {title && (
            <Typography variant="h6" className="font-semibold text-gray-900">
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography className="text-gray-500 text-sm">{subtitle}</Typography>
          )}
        </div>

        <div className="flex justify-center">
          <svg width={width} height={height} className="overflow-visible">

            {/* Background */}
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="white"
              rx="16"
            />

            {/* Y-axis grid lines and labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
              const y = padding.top + chartH * t;
              const value = Math.round(maxValue * (1 - t));
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + chartW}
                    y2={y}
                    stroke="#E5E7EB"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[14px] font-medium text-gray-400"
                  >
                    {value.toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* Baseline axis line */}
            <line
              x1={padding.left}
              y1={padding.top + chartH}
              x2={padding.left + chartW}
              y2={padding.top + chartH}
              stroke="#9CA3AF"
              strokeWidth="2"
            />

            {/* Area (blue faded) */}
            <path
              d={`${path} L ${points[points.length - 1].x},${padding.top + chartH} 
                  L ${points[0].x},${padding.top + chartH} Z`}
              fill={color}
              opacity="0.15"
            />

            {/* Line */}
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Points */}
            {points.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoverIndex === i ? 12 : 8}
                  fill="white"
                  stroke={color}
                  strokeWidth="3"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                />

                {/* X axis labels */}
                <text
                  x={p.x}
                  y={padding.top + chartH + 25}
                  textAnchor="middle"
                  className={`text-[13px] font-semibold ${
                    i === hoverIndex ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {p.label}
                </text>

                {/* Tooltip */}
                {hoverIndex === i && (
                  <g>
                    <rect
                      x={p.x - 45}
                      y={p.y - 55}
                      width="90"
                      height="36"
                      rx="10"
                      fill="#1d1d1d"
                      opacity="0.85"
                    />
                    <text
                      x={p.x}
                      y={p.y - 32}
                      textAnchor="middle"
                      fill="white"
                      fontSize="16"
                      fontWeight="bold"
                    >
                      {p.value}
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>
      </CardBody>
    </Card>
  );
};

export const BarChart = (props) => <UniversalChart {...props} />;
export const LineChart = (props) => <UniversalChart {...props} />;
export const AreaChart = (props) => <UniversalChart {...props} />;

export default UniversalChart;
