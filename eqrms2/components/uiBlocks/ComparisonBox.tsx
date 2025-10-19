interface ComparisonBoxProps {
  leftHeader: string;
  rightHeader: string;
  leftColor: 'green' | 'red' | 'blue' | 'yellow' | 'gray' | 'purple';
  rightColor: 'green' | 'red' | 'blue' | 'yellow' | 'gray' | 'purple';
  leftChildren: React.ReactNode;
  rightChildren: React.ReactNode;
}

export default function ComparisonBox({ 
  leftHeader, 
  rightHeader, 
  leftColor, 
  rightColor, 
  leftChildren,
  rightChildren
}: ComparisonBoxProps) {
  const colorStyles = {
    green: {
      background: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-200'
    },
    red: {
      background: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200'
    },
    blue: {
      background: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200'
    },
    yellow: {
      background: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200'
    },
    gray: {
      background: 'bg-gray-50',
      text: 'text-gray-800',
      border: 'border-gray-200'
    },
    purple: {
      background: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-200'
    }
  };

  const leftStyles = colorStyles[leftColor];
  const rightStyles = colorStyles[rightColor];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {/* Left Column */}
      <div className={`${leftStyles.background} ${leftStyles.border} border rounded-lg p-4`}>
        <h4 className={`${leftStyles.text} font-bold text-lg mb-3 text-center`}>
          {leftHeader}
        </h4>
        <div className={`${leftStyles.text} text-sm`}>
          {leftChildren}
        </div>
      </div>

      {/* Right Column */}
      <div className={`${rightStyles.background} ${rightStyles.border} border rounded-lg p-4`}>
        <h4 className={`${rightStyles.text} font-bold text-lg mb-3 text-center`}>
          {rightHeader}
        </h4>
        <div className={`${rightStyles.text} text-sm`}>
          {rightChildren}
        </div>
      </div>
    </div>
  );
}
