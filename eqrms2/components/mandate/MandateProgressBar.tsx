'use client';

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MandateProgressBarProps {
  background_done?: boolean | null;
  risk_profile_done?: boolean | null;
  fin_plan_done?: boolean | null;
  inv_plan_done?: boolean | null;
  shortlisting_done?: boolean | null;
}

const TASK_LABELS = {
  background_done: 'Background',
  risk_profile_done: 'Risk Profile',
  fin_plan_done: 'Financial Plan',
  inv_plan_done: 'Investment Plan',
  shortlisting_done: 'Shortlisting'
} as const;

export function MandateProgressBar({
  background_done,
  risk_profile_done,
  fin_plan_done,
  inv_plan_done,
  shortlisting_done
}: MandateProgressBarProps) {
  // Calculate progress
  const tasks = [
    { key: 'background_done', done: background_done },
    { key: 'risk_profile_done', done: risk_profile_done },
    { key: 'fin_plan_done', done: fin_plan_done },
    { key: 'inv_plan_done', done: inv_plan_done },
    { key: 'shortlisting_done', done: shortlisting_done }
  ];

  const completedCount = tasks.filter(task => task.done === true).length;
  const progressPercentage = completedCount * 20;

  // Determine color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage === 0) return 'bg-red-900'; // dark red
    if (percentage === 20) return 'bg-red-500'; // red
    if (percentage === 40) return 'bg-yellow-500'; // yellow
    if (percentage === 60) return 'bg-orange-500'; // orange
    if (percentage === 80) return 'bg-green-500'; // green
    if (percentage === 100) return 'bg-green-700'; // dark green
    // For values between thresholds, use the lower threshold color
    if (percentage < 20) return 'bg-red-900';
    if (percentage < 40) return 'bg-red-500';
    if (percentage < 60) return 'bg-yellow-500';
    if (percentage < 80) return 'bg-orange-500';
    if (percentage < 100) return 'bg-green-500';
    return 'bg-green-700';
  };

  const progressColor = getProgressColor(progressPercentage);

  // Separate completed and pending tasks
  const completed = tasks
    .filter(task => task.done === true)
    .map(task => TASK_LABELS[task.key as keyof typeof TASK_LABELS]);
  
  const pending = tasks
    .filter(task => task.done !== true)
    .map(task => TASK_LABELS[task.key as keyof typeof TASK_LABELS]);

  return (
    <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <Progress 
            value={progressPercentage} 
            className="w-full"
          />
          <style jsx>{`
            :global([data-slot="progress-indicator"]) {
              background-color: ${progressColor === 'bg-red-900' ? '#7f1d1d' :
                                progressColor === 'bg-red-500' ? '#ef4444' :
                                progressColor === 'bg-yellow-500' ? '#eab308' :
                                progressColor === 'bg-orange-500' ? '#f97316' :
                                progressColor === 'bg-green-500' ? '#22c55e' :
                                progressColor === 'bg-green-700' ? '#15803d' : '#22c55e'} !important;
            }
          `}</style>
        </div>
        <span className="text-sm font-semibold whitespace-nowrap">
          {progressPercentage}%
        </span>
      </div>
      <div className="text-xs text-gray-600">
        {completed.length > 0 && (
          <span className="bg-green-50 p-1 rounded-md text-green-800">
            <span className="font-semibold">Completed:</span> {completed.join(', ')}
          </span>
        )}
        {completed.length > 0 && pending.length > 0 && ' | '}
        {pending.length > 0 && (
          <span className="bg-red-50 p-1 rounded-md text-red-800">
            <span className="font-semibold">Pending:</span> {pending.join(', ')}
          </span>
        )}
      </div>
    </div>
  );
}

