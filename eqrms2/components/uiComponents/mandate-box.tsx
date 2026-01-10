// MandateBox.tsx
// Reusable component for mandate page boxes with heading and content
// Usage:
//   <MandateBox heading="Investments Purpose">
//     <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
//   </MandateBox>

import React from 'react';

type MandateBoxProps = {
  heading: string;
  children: React.ReactNode;
  className?: string;
};

const MandateBox: React.FC<MandateBoxProps> = ({
  heading,
  children,
  className = 'border-2 border-gray-200 rounded-md my-6 text-sm',
}) => {
  return (
    <div className={`${className}`}>
      <p className="font-bold bg-gray-100 p-2 !my-0">{heading}</p>
      <div className="p-2">{children}</div>
    </div>
  );
};

export default MandateBox;
