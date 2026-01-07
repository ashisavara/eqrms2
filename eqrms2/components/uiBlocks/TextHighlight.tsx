'use client';

interface TextHighlightProps {
  children: React.ReactNode;
}

export default function TextHighlight({ children }: TextHighlightProps) {
  return (
    <div className="text-gray-600 border-y-2 border-gray-300 pt-3 pb-3 text-center my-4 font-medium">
      {children}
    </div>
  );
}
