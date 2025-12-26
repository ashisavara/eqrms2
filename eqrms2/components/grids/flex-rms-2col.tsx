import { ReactNode } from "react";

interface FlexRms2ColProps {
  label: string;
  children: ReactNode;
}

export function FlexRms2Col({ label, children }: FlexRms2ColProps) {
  return (
    <div className="flex flex-col md:flex-row mb-2">
      <div className="w-full md:w-[200px] md:min-w-[180px] md:flex-shrink-0">
        <span className="font-bold">{label}</span>
      </div>
      <div className="w-full md:flex-1 md:min-w-0 mx-2">
        {children}
      </div>
    </div>
  );
}

