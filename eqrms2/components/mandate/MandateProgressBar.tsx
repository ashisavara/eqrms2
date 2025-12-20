'use client';

import { Progress } from "@/components/ui/progress";
import { useEffect, useRef } from "react";

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
  const progressRef = useRef<HTMLDivElement>(null);

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
  const getProgressColor = (percentage: number): string => {
    if (percentage === 0) return '#7f1d1d'; // dark red
    if (percentage === 20) return '#ef4444'; // red
    if (percentage === 40) return '#eab308'; // yellow
    if (percentage === 60) return '#f97316'; // orange
    if (percentage === 80) return '#22c55e'; // green
    if (percentage === 100) return '#15803d'; // dark green
    // For values between thresholds, use the lower threshold color
    if (percentage < 20) return '#7f1d1d';
    if (percentage < 40) return '#ef4444';
    if (percentage < 60) return '#eab308';
    if (percentage < 80) return '#f97316';
    if (percentage < 100) return '#22c55e';
    return '#15803d';
  };

  const progressColor = getProgressColor(progressPercentage);

  // Apply color to progress indicator
  useEffect(() => {
    if (progressRef.current) {
      const indicator = progressRef.current.querySelector('[data-slot="progress-indicator"]') as HTMLElement;
      if (indicator) {
        indicator.style.backgroundColor = progressColor;
      }
    }
  }, [progressColor]);

  // Separate completed and pending tasks
  const completed = tasks
    .filter(task => task.done === true)
    .map(task => TASK_LABELS[task.key as keyof typeof TASK_LABELS]);
  
  const pending = tasks
    .filter(task => task.done !== true)
    .map(task => TASK_LABELS[task.key as keyof typeof TASK_LABELS]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div ref={progressRef} className="flex-1">
          <Progress 
            value={progressPercentage} 
            className="w-full"
          />
        </div>
        <span className="text-sm font-semibold whitespace-nowrap">
          {progressPercentage}%
        </span>
      </div>
      <div className="text-xs text-gray-600">
        {completed.length > 0 && (
          <span>
            <span className="font-semibold">Completed:</span> {completed.join(', ')}
          </span>
        )}
        {completed.length > 0 && pending.length > 0 && ' | '}
        {pending.length > 0 && (
          <span>
            <span className="font-semibold">Pending:</span> {pending.join(', ')}
          </span>
        )}
      </div>
    </div>
  );
}

