// TeamProfileBox.tsx
// A reusable component for team member profiles with configurable layout direction
// Usage: <TeamProfileBox direction="left" imgSrc="..." name="..." designation="...">Description content</TeamProfileBox>

import React from 'react';
import { Button } from "@/components/ui/button";

type TeamProfileBoxProps = {
  imgSrc: string;
  name: string;
  designation: string;
  children: React.ReactNode;
  className?: string;
};

const TeamProfileBox: React.FC<TeamProfileBoxProps> = ({
  imgSrc,
  name,
  designation,
  children,
  className = ''
}) => {
  
  return (
    <div className={`py-8 border-b-2 border-gray-200 ime-team-profile-box ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,250px)_1fr] gap-4">
        {/* Image Section */}
        <div className="pt-4 md:pr-12 text-center">
          <div className="w-[150px] h-[150px] mx-auto rounded-3xl overflow-hidden shadow-sm">
          <img 
            src={imgSrc} 
            alt={name} 
              className="w-full h-full object-cover object-center" 
          />
          </div>
          <div className="pt-3">
            <span className="font-bold">{name}</span><br/>
            <span>{designation}</span>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="text-base text-center md:text-left">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TeamProfileBox;
