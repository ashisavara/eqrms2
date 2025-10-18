interface AlertBoxProps {
  color: 'blue' | 'green' | 'red' | 'yellow' | 'gray';
  heading: string;
  children: React.ReactNode;
}

export default function AlertBox({ color, heading, children }: AlertBoxProps) {
  const colorStyles = {
    blue: {
      background: 'bg-blue-50',
      heading: 'text-blue-800',
      border: 'border-blue-800'
    },
    green: {
      background: 'bg-green-50',
      heading: 'text-green-900',
      border: 'border-green-800'
    },
    red: {
      background: 'bg-red-50',
      heading: 'text-red-900',
      border: 'border-red-800'
    },
    yellow: {
      background: 'bg-yellow-50',
      heading: 'text-yellow-900',
      border: 'border-yellow-200'
    }, 
    gray: {
      background: 'bg-gray-50',
      heading: 'text-gray-800',
      border: 'border-gray-800'
    }
  };

  const styles = colorStyles[color];

  return (
    <div className={`${styles.background} ${styles.border} border rounded-lg p-4 my-4`}>
      <h4 className={`${styles.heading} font-bold text-base mb-2 text-center`}>
        {heading}
      </h4>
      <div className="text-gray-800 text-sm">
        {children}
      </div>
    </div>
  );
}
