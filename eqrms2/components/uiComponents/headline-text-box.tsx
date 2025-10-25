// HeadlineTextBox.tsx
// Two-column layout: prominent headline + descriptive content.
//
// Props:
// - headline: React.ReactNode (required)
// - alignHeadline?: 'left' | 'right' (default: 'left')
// - headlineClassName?: string (default: blue, larger font)
// - childrenClassName?: string (applied to wrapper around children, default spacing)
// - className?: string (wrapper overrides for the whole block)
//
// Usage:
// <HeadlineTextBox
//   headline={<>Inflation is clearly on the rise</>}
//   alignHeadline="left"
// >
//   <p>Longer explanatory text here...</p>
// </HeadlineTextBox>

import React from 'react';

type HeadlineTextBoxProps = {
  headline: React.ReactNode;
  alignHeadline?: 'left' | 'right';
  headlineClassName?: string;
  childrenClassName?: string;
  className?: string;
  children: React.ReactNode;
};

const HeadlineTextBox: React.FC<HeadlineTextBoxProps> = ({
  headline,
  alignHeadline = 'left',
  headlineClassName = 'text-lg font-semibold text-blue-900',
  childrenClassName = 'space-y-4',
  className = 'py-4',
  children,
}) => {
  const HeadlineCol = (
    <div className={`max-w-[200px] w-full mx-auto ${headlineClassName}`}>
      {headline}
    </div>
  );

  const ContentCol = (
    <div className={childrenClassName}>
      {children}
    </div>
  );

  const gridColsClass = alignHeadline === 'left'
    ? 'md:grid-cols-[200px_1fr]'
    : 'md:grid-cols-[1fr_200px]';

  return (
    <div className={`ime-grid-2col ${gridColsClass} ${className}`}>
      {alignHeadline === 'left' ? (
        <>
          {HeadlineCol}
          {ContentCol}
        </>
      ) : (
        <>
          {ContentCol}
          {HeadlineCol}
        </>
      )}
    </div>
  );
};

export default HeadlineTextBox;


