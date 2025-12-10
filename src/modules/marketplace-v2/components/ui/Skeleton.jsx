
/**
 * Skeleton loading component
 * Variants: card, metric, chart, list, text
 */
const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
  animate = true
}) => {
  const baseClass = `mp-skeleton ${animate ? '' : 'animation-none'} ${className}`;

  // Render multiple skeletons if count > 1
  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} variant={variant} width={width} height={height} className={className} />
        ))}
      </div>
    );
  }

  switch (variant) {
    case 'metric':
      return (
        <div className="mp-glass-card p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className={baseClass} style={{ width: '60%', height: '16px' }} />
              <div className={baseClass} style={{ width: '40%', height: '32px' }} />
              <div className={baseClass} style={{ width: '50%', height: '14px' }} />
            </div>
            <div
              className={baseClass}
              style={{ width: '48px', height: '48px', borderRadius: 'var(--mp-radius-lg)' }}
            />
          </div>
        </div>
      );

    case 'card':
      return (
        <div className="mp-glass-card p-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={baseClass}
                style={{ width: '40px', height: '40px', borderRadius: 'var(--mp-radius-full)' }}
              />
              <div className="flex-1 space-y-2">
                <div className={baseClass} style={{ width: '70%', height: '16px' }} />
                <div className={baseClass} style={{ width: '40%', height: '14px' }} />
              </div>
            </div>
            <div className={baseClass} style={{ width: '100%', height: '14px' }} />
            <div className={baseClass} style={{ width: '80%', height: '14px' }} />
            <div className="flex gap-3 pt-2">
              <div className={baseClass} style={{ width: '60px', height: '24px', borderRadius: 'var(--mp-radius-full)' }} />
              <div className={baseClass} style={{ width: '80px', height: '24px', borderRadius: 'var(--mp-radius-full)' }} />
            </div>
          </div>
        </div>
      );

    case 'chart':
      return (
        <div className="mp-glass-card p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className={baseClass} style={{ width: '150px', height: '24px' }} />
              <div className="flex gap-2">
                <div className={baseClass} style={{ width: '60px', height: '32px', borderRadius: 'var(--mp-radius-md)' }} />
                <div className={baseClass} style={{ width: '60px', height: '32px', borderRadius: 'var(--mp-radius-md)' }} />
              </div>
            </div>
            <div
              className={baseClass}
              style={{ width: '100%', height: height || '200px', borderRadius: 'var(--mp-radius-lg)' }}
            />
          </div>
        </div>
      );

    case 'list':
      return (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <div
                className={baseClass}
                style={{ width: '40px', height: '40px', borderRadius: 'var(--mp-radius-full)' }}
              />
              <div className="flex-1 space-y-2">
                <div className={baseClass} style={{ width: `${70 - i * 10}%`, height: '14px' }} />
                <div className={baseClass} style={{ width: `${50 - i * 5}%`, height: '12px' }} />
              </div>
              <div className={baseClass} style={{ width: '60px', height: '12px' }} />
            </div>
          ))}
        </div>
      );

    case 'table':
      return (
        <div className="space-y-2">
          {/* Header */}
          <div className="flex gap-4 p-3 border-b" style={{ borderColor: 'var(--mp-border-light)' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={baseClass} style={{ width: `${100 / 5}%`, height: '16px' }} />
            ))}
          </div>
          {/* Rows */}
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 p-3">
              {Array.from({ length: 5 }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className={baseClass}
                  style={{ width: `${100 / 5}%`, height: '14px' }}
                />
              ))}
            </div>
          ))}
        </div>
      );

    case 'avatar':
      return (
        <div
          className={baseClass}
          style={{
            width: width || '40px',
            height: height || '40px',
            borderRadius: 'var(--mp-radius-full)'
          }}
        />
      );

    case 'text':
    default:
      return (
        <div
          className={baseClass}
          style={{
            width: width || '100%',
            height: height || '16px'
          }}
        />
      );
  }
};

/**
 * Metric card skeleton specifically for dashboard
 */
export const MetricCardSkeleton = () => <Skeleton variant="metric" />;

/**
 * Order card skeleton
 */
export const OrderCardSkeleton = () => <Skeleton variant="card" />;

/**
 * Chart skeleton
 */
export const ChartSkeleton = ({ height }) => <Skeleton variant="chart" height={height} />;

/**
 * List skeleton
 */
export const ListSkeleton = ({ count = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton width={`${70 - i * 10}%`} height="14px" />
          <Skeleton width={`${50 - i * 5}%`} height="12px" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
