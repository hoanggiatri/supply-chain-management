import React from "react";

/**
 * SkeletonLoader - Loading placeholder with shimmer animation
 * Variants: card, list, detail, metric
 */
const SkeletonLoader = ({ variant = "card", count = 1, className = "" }) => {
  const shimmerClass =
    "animate-pulse bg-gradient-to-r from-blue-gray-100 via-blue-gray-50 to-blue-gray-100 bg-[length:200%_100%]";

  // Card skeleton for order cards
  const CardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-blue-gray-100 overflow-hidden">
      {/* Image placeholder */}
      <div className={`h-40 ${shimmerClass}`} />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className={`h-5 w-3/4 rounded ${shimmerClass}`} />

        {/* Subtitle */}
        <div className={`h-4 w-1/2 rounded ${shimmerClass}`} />

        {/* Status badge */}
        <div className="flex items-center justify-between pt-2">
          <div className={`h-6 w-20 rounded-full ${shimmerClass}`} />
          <div className={`h-4 w-24 rounded ${shimmerClass}`} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-blue-gray-50">
          <div className={`h-4 w-16 rounded ${shimmerClass}`} />
          <div className={`h-4 w-20 rounded ${shimmerClass}`} />
        </div>
      </div>
    </div>
  );

  // Metric card skeleton for dashboard
  const MetricSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-blue-gray-100 p-6">
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className={`h-12 w-12 rounded-lg ${shimmerClass}`} />

        {/* Trend indicator */}
        <div className={`h-6 w-16 rounded-full ${shimmerClass}`} />
      </div>

      {/* Value */}
      <div className={`h-8 w-24 rounded mt-4 ${shimmerClass}`} />

      {/* Label */}
      <div className={`h-4 w-32 rounded mt-2 ${shimmerClass}`} />
    </div>
  );

  // List item skeleton
  const ListSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-blue-gray-100 p-4 flex items-center gap-4">
      {/* Avatar/Icon */}
      <div className={`h-12 w-12 rounded-lg shrink-0 ${shimmerClass}`} />

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className={`h-4 w-3/4 rounded ${shimmerClass}`} />
        <div className={`h-3 w-1/2 rounded ${shimmerClass}`} />
      </div>

      {/* Action */}
      <div className={`h-8 w-8 rounded-full shrink-0 ${shimmerClass}`} />
    </div>
  );

  // Detail page skeleton
  const DetailSkeleton = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className={`h-6 w-48 rounded ${shimmerClass}`} />
            <div className={`h-4 w-32 rounded ${shimmerClass}`} />
          </div>
          <div className={`h-8 w-24 rounded-full ${shimmerClass}`} />
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className={`h-3 w-16 rounded ${shimmerClass}`} />
              <div className={`h-5 w-24 rounded ${shimmerClass}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );

  // Chart skeleton
  const ChartSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-blue-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className={`h-5 w-32 rounded ${shimmerClass}`} />
        <div className={`h-8 w-24 rounded ${shimmerClass}`} />
      </div>

      {/* Chart area */}
      <div className={`h-64 rounded-lg ${shimmerClass}`} />
    </div>
  );

  // Render based on variant
  const renderSkeleton = () => {
    switch (variant) {
      case "metric":
        return [...Array(count)].map((_, i) => <MetricSkeleton key={i} />);
      case "list":
        return [...Array(count)].map((_, i) => <ListSkeleton key={i} />);
      case "detail":
        return <DetailSkeleton />;
      case "chart":
        return <ChartSkeleton />;
      case "card":
      default:
        return [...Array(count)].map((_, i) => <CardSkeleton key={i} />);
    }
  };

  // Wrapper based on variant
  const getWrapperClass = () => {
    switch (variant) {
      case "metric":
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";
      case "list":
        return "space-y-3";
      case "card":
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
      default:
        return "";
    }
  };

  if (variant === "detail" || variant === "chart") {
    return <div className={className}>{renderSkeleton()}</div>;
  }

  return (
    <div className={`${getWrapperClass()} ${className}`}>
      {renderSkeleton()}
    </div>
  );
};

export default SkeletonLoader;
