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
  headingClassName = 'text-2xl font-bold',
  subHeadingClassName = 'font-bold',
  contentClassName = 'space-y-4',
  imageColClassName = 'w-full',
}) => {
  const ImageCol = (
    <div>
      <img src={imgSrc} alt={heading} className="{imageColClassName} shadow-sm px-5"/>
    </div>
  );

  const TextCol = (
    <div className="text-lg text-left md:text-center space-y-4 first:mt-0 last:mb-0">
      <h4 className={headingClassName}>{heading}</h4>
      {subHeading ? <p className={subHeadingClassName}>{subHeading}</p> : null}
      <div className={contentClassName}>{children}</div>
    </div>
  );

  return (
    <div className={`ime-grid-2col items-center ${className}`}>
      {imgSide === 'left' ? (
        <>
          {ImageCol}
          {TextCol}
        </>
      ) : (
        <>
          {TextCol}
          {ImageCol}
        </>
      )}
    </div>
  );
};

export default ImageTextBox;


