import { ReactNode } from 'react';

interface SectionTextHighlightProps {
  children: ReactNode;
  color?: 'green' | 'blue' | 'gray' | 'red';
  className?: string;
}

export default function SectionTextHighlight({ 
  children, 
  color = 'green',
  className = ''
}: SectionTextHighlightProps) {
  const colorClasses = {
    green: 'bg-green-900',
    blue: 'bg-blue-900',
    gray: 'bg-gray-900',
    red: 'bg-red-900'
  };

  return (
    <section className={`w-full ${colorClasses[color]} py-12 text-white text-center ${className}`}>
      <div className="max-w-5xl mx-auto px-4 prose prose-invert">
        {children}
      </div>
    </section>
  );
}
