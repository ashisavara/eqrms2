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
      <div className="ime-grid-2col flex">
        {/* Image Section */}
        <div className={`w-[700px] pt-10 pr-12 text-center`}>
          <img 
            src={imgSrc} 
            alt={name} 
            className="rounded-3xl w-[150px] h-[150px] mx-auto shadow-sm" 
          />
          <div className="pt-3">
            <span className="font-bold">{name}</span><br/>
            <span>{designation}</span>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="text-base">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TeamProfileBox;
