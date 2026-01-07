// HeroImgTitle.tsx
// Hero section with title, optional caption, and image side-by-side
// Usage:
//   <HeroImgTitle 
//     title="Family Solutions" 
//     caption="Tailored Investment Solutions to help secure your family's future"
//     imgSrc="path/to/image.jpg"
//     imgAlt="Family Solutions"
//   />
// Props:
// - title: string (required)
// - caption?: string (optional)
// - imgSrc: string (required)
// - imgAlt: string (required)
// - className?: string (optional) wrapper overrides

import React from 'react';

type HeroImgTitleProps = {
  title: string;
  caption?: string;
  imgSrc: string;
  imgAlt: string;
  className?: string;
};

const HeroImgTitle: React.FC<HeroImgTitleProps> = ({
  title,
  caption,
  imgSrc,
  imgAlt,
  className = 'flex flex-col md:flex-row bg-blue-950',
}) => {
  return (
    <div className={className}>
      <div className="min-w-[400px] w-full md:w-1/4 px-6 flex flex-col justify-center">
        <h2 className="bg-gray-200 text-blue-950 text-center">{title}</h2>
        {caption ? <p className="text-white text-center">{caption}</p> : null}
      </div>
      <div className="w-full">
        <img src={imgSrc} alt={imgAlt} className="w-full mx-auto"></img>
      </div>
    </div>
  );
};

export default HeroImgTitle;

