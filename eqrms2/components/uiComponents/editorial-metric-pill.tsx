import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type EditorialMetricPillProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

/**
 * Horizontal pill: muted label + value (colored badge, plain emphasis text, or any node).
 * Styled for editorial / blog metrics (stance, ranges, etc.).
 */
export default function EditorialMetricPill({ label, children, className }: EditorialMetricPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-700 shadow-sm",
        className,
      )}
    >
      <span className="text-stone-500">{label}</span>
      {children}
    </span>
  );
}
