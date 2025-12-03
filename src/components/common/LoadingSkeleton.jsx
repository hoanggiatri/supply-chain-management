import React from "react";
import { Card, CardBody } from "@material-tailwind/react";

/**
 * Skeleton Loader Component
 * Displays animated loading placeholders
 */
export const SkeletonText = ({ lines = 1, className = "" }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"
          style={{
            width: index === lines - 1 ? "70%" : "100%",
            animationDelay: `${index * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardBody>
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-4" />
            <SkeletonText lines={3} />
          </CardBody>
        </Card>
      ))}
    </>
  );
};

export const SkeletonTable = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="grid gap-4 p-4 border-b border-gray-200" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {[...Array(columns)].map((_, index) => (
          <div key={index} className="h-4 bg-gray-300 rounded animate-pulse" />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4 p-4 border-b border-gray-100"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {[...Array(columns)].map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-gray-200 rounded animate-pulse"
              style={{ animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const SkeletonAvatar = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-gray-300 rounded-full animate-pulse`}
    />
  );
};

export const SkeletonButton = ({ className = "" }) => {
  return (
    <div className={`h-10 w-24 bg-gray-300 rounded animate-pulse ${className}`} />
  );
};

export const SkeletonImage = ({ className = "" }) => {
  return (
    <div className={`bg-gray-300 rounded animate-pulse ${className}`} style={{ aspectRatio: "16/9" }} />
  );
};

const LoadingSkeleton = ({ type = "card", ...props }) => {
  switch (type) {
    case "text":
      return <SkeletonText {...props} />;
    case "card":
      return <SkeletonCard {...props} />;
    case "table":
      return <SkeletonTable {...props} />;
    case "avatar":
      return <SkeletonAvatar {...props} />;
    case "button":
      return <SkeletonButton {...props} />;
    case "image":
      return <SkeletonImage {...props} />;
    default:
      return <SkeletonCard {...props} />;
  }
};

export default LoadingSkeleton;
