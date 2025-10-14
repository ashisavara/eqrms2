"use client";

interface ProgressBarProps {
  current: number;    // Current question index (0-based)
  total: number;      // Total number of questions
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  // Calculate percentage (add 1 to current since it's 0-based)
  const percentage = total > 0 ? ((current + 1) / total) * 100 : 0;
  
  return (
    <div className="w-full mb-8">
      {/* Progress text */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Question {current + 1} of {total}
        </span>
        <span className="text-sm font-medium text-gray-500">
          {Math.round(percentage)}%
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`Progress: ${current + 1} of ${total} questions completed`}
        />
      </div>
    </div>
  );
}

