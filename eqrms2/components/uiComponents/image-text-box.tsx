// ImageTextBox.tsx
// Two-column block with an image and text content. Supports image left/right and style overrides.

import React from 'react';

type ImageTextBoxProps = {
  imgSrc: string;
  heading: string;
  subHeading?: string;
  children: React.ReactNode;
  imgSide?: 'left' | 'right';
  className?: string; // wrapper overrides
  headingClassName?: string;
  subHeadingClassName?: string;
  contentClassName?: string; // wrapper around children text
  imageColClassName?: string; // width/spacing for image column
};

const ImageTextBox: React.FC<ImageTextBoxProps> = ({
  imgSrc,
  heading,
  subHeading,
  children,
  imgSide = 'left',
  className = '',
  headingClassName = 'text-2xl font-bold text-gray-700',
  subHeadingClassName = 'font-bold text-gray-800',
  contentClassName = 'space-y-4',
  imageColClassName = 'w-full',
}) => {
  // Determine order classes based on imgSide
  // Below md: always image first (order-1), text second (order-2)
  // At md and above: respect imgSide prop
  const imageOrderClass = imgSide === 'left' ? 'order-1 md:order-1' : 'order-1 md:order-2';
  const textOrderClass = imgSide === 'left' ? 'order-2 md:order-2' : 'order-2 md:order-1';

  const ImageCol = (
    <div className={imageOrderClass}>
      {/* Heading shown on mobile, hidden on md and above */}
      <h4 className={`${headingClassName} block md:hidden text-center mb-4`}>{heading}</h4>
      <img 
        src={imgSrc} 
        alt={heading} 
        className={`${imageColClassName} shadow-sm px-5`} 
        style={{ width: '85%', maxWidth: '85%' }}
      />
    </div>
  );

  const TextCol = (
    <div className={`text-base text-center space-y-4 first:mt-0 last:mb-0 text-gray-800 ${textOrderClass}`}>
      {/* Heading hidden on mobile, shown on md and above */}
      <h4 className={`${headingClassName} hidden md:block`}>{heading}</h4>
      {subHeading ? <p className={subHeadingClassName}>{subHeading}</p> : null}
      <div className={contentClassName}>{children}</div>
    </div>
  );

  return (
    <div className={`ime-grid-2col items-center ${className}`}>
      {ImageCol}
      {TextCol}
    </div>
  );
};

export default ImageTextBox;


