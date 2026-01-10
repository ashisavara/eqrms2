// ToggleVisibility.tsx
// this can be called via another file by simply calling <ToggleVisibility toggleText="Text to show" > whatever is in here gets passed in as a child</ToggleVisibility>
// the children prop is the content that will be shown when the toggle is clicked

'use client';

import React, { useState } from 'react';

type ToggleVisibilityProps = {
  toggleText: string;
  children: React.ReactNode;
  className?: string;
};

const ToggleVisibility: React.FC<ToggleVisibilityProps> = ({ toggleText, children, className }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)} className={className || "text-sm my-2 bg-blue-100 font-bold p-1 border-2 border-blue-400 rounded-md text-blue-900 hover:underline hover:bg-blue-800 hover:text-blue-50"}>
        {toggleText}
      </button>
      {isVisible && (
        <div className="border p-4 rounded shadow-lg">
          <button onClick={() => setIsVisible(false)} className="text-right mb-2 text-red-500 text-sm font-bold">
            Close
          </button>
          {children}
        </div>
      )}
    </div>
  );
};

export default ToggleVisibility;
