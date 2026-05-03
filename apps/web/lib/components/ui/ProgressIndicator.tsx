// src/components/ui/ProgressIndicator.tsx
interface ProgressIndicatorProps {
  current: number;
  total: number;
  label: string;
  className?: string;
}

export function ProgressIndicator({
  current,
  total,
  label,
  className = '',
}: ProgressIndicatorProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-blue-600">
          Step {current} of {total}: {label}
        </span>
        <span className="text-sm text-gray-500">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}