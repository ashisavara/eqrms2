'use client';

interface AlertBoxProps {
  color: 'blue' | 'green' | 'red' | 'yellow' | 'gray';
  heading: string;
  children: React.ReactNode;
}

export default function AlertBox({ color, heading, children }: AlertBoxProps) {
  const colorStyles = {
    blue: {
      background: 'bg-gray-50',
      headingbg: 'bg-blue-900',
      heading: 'text-blue-50',
      border: 'border-gray-400'
    },
    green: {
      background: 'bg-gray-50',
      headingbg: 'bg-green-900',
      heading: 'text-green-50',
      border: 'border-gray-400'
    },
    red: {
      background: 'bg-gray-50',
      headingbg: 'bg-red-900',
      heading: 'text-red-50',
      border: 'border-gray-400'
    },
    yellow: {
      background: 'bg-gray-50',
      headingbg: 'bg-yellow-800',
      heading: 'text-yellow-50',
      border: 'border-gray-400'
    }, 
    gray: {
      background: 'bg-gray-50',
      headingbg: 'bg-gray-600',
      heading: 'text-gray-50',
      border: 'border-gray-400'
    }
  };

  const styles = colorStyles[color];

  return (
    <div className={`${styles.background} ${styles.border} border rounded-lg my-8`}>
      <div className={`${styles.headingbg} w-full px-4 py-3`}>
        <h4 className={`${styles.heading} text-center font-bold text-lg`}>
          {heading}
        </h4>
      </div>
      <div className="px-4 py-4 text-[15px] text-left">
        {children}
      </div>
    </div>
  );
}
