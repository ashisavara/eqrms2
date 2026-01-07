import { ReactNode } from 'react';

interface SectionTextHighlightProps {
  children: ReactNode;
  color?: 'green' | 'blue' | 'gray' | 'red';
  className?: string;
}

export default function SectionTextHighlight({ 
  children, 
  color = 'gray',
  className = ''
}: SectionTextHighlightProps) {
  const colorClasses = {
    green: 'bg-green-900',
    blue: 'bg-blue-950',
    gray: 'bg-gray-100',
    red: 'bg-red-900'
  };

  const textColorClasses = {
    green: 'text-white',
    blue: 'text-white',
    gray: 'text-gray-900',
    red: 'text-white'
  };

  return (
    <section className={`w-full ${colorClasses[color]} py-12 text-center ${className}`}>
      <div className={`max-w-5xl mx-auto px-4 text-lg ${textColorClasses[color]}`}>
        {children}
      </div>
    </section>
  );
}
