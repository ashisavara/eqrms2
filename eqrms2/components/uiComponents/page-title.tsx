// PageTitle.tsx
// Simple page title header with optional caption.
// Usage:
//   <PageTitle title="Depth of Expertise" caption="Understanding what makes our Expertise different" />
// Props:
// - title: string (required)
// - caption?: string (optional)
// - className?: string (optional) section wrapper overrides
// - titleClassName?: string (optional) h2 overrides
// - captionClassName?: string (optional) caption p overrides

import React from 'react';
import Section from '@/components/uiComponents/section';

type PageTitleProps = {
  title: string;
  caption?: string;
  className?: string;
  titleClassName?: string;
  captionClassName?: string;
};

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  caption,
  className = 'bg-blue-950 pt-10 pb-4 mb-2 text-white text-center',
  titleClassName = 'bg-gray-200 text-blue-950',
  captionClassName = 'text-gray-50',
}) => {
  return (
    <Section className={className}>
      <h2 className={titleClassName}>{title}</h2>
      {caption ? <p className={captionClassName}>{caption}</p> : null}
    </Section>
  );
};

export default PageTitle;


