// Section.tsx
// A full-width section component with constrained content width
// Usage: <Section bg="bg-gray-100">Your content here</Section>

import React from 'react';

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

const Section: React.FC<SectionProps> = ({ 
  children, 
  className = '',
  contentClassName = ''
}) => {
  return (
    <section className={`w-full ${className}`}>
      <div className={`max-w-5xl mx-auto px-4 ${contentClassName}`}>
        {children}
      </div>
    </section>
  );
};

export default Section;
