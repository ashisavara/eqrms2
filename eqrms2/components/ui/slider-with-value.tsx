"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export interface SliderWithValueProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onValueChange: (value: number) => void;
  formatValue?: (value: number) => string;
  className?: string;
  "aria-label"?: string;
}

/**
 * Slider that shows the selected value below the thumb.
 * Use for single-value sliders with min, max, and step.
 */
function SliderWithValue({
  min,
  max,
  step,
  value,
  onValueChange,
  formatValue = (v) => String(v),
  className,
  "aria-label": ariaLabel,
}: SliderWithValueProps) {
  const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className={cn("relative w-full pb-6", className)}>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(v) => onValueChange(v[0] ?? min)}
        aria-label={ariaLabel}
      />
      <div
        className="absolute bottom-0 text-sm font-medium text-foreground -translate-x-1/2"
        style={{ left: `${percentage}%` }}
        aria-hidden
      >
        {formatValue(value)}
      </div>
    </div>
  );
}

export { SliderWithValue };
