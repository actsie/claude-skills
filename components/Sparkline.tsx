interface SparklineProps {
  data: number[]; // 7 data points
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export default function Sparkline({
  data,
  width = 60,
  height = 20,
  color = '#10b981', // green by default
  className = '',
}: SparklineProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // Find min and max for normalization
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;

  // If all values are the same, show a flat line in the middle
  const isFlatLine = range === 0;

  // Normalize data points to fit in the SVG viewBox
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = isFlatLine
      ? height / 2
      : height - ((value - min) / range) * height;
    return { x, y };
  });

  // Create path for the line
  const linePath = points
    .map((point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${point.x},${point.y}`;
    })
    .join(' ');

  // Create path for the filled area (close the path at the bottom)
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label="7-day trend sparkline"
    >
      {/* Filled area with 20% opacity */}
      <path
        d={areaPath}
        fill={color}
        fillOpacity="0.2"
      />
      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
