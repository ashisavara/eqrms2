interface AlertBoxProps {
  color: 'blue' | 'green' | 'red' | 'yellow' | 'gray';
  heading: string;
  children: React.ReactNode;
}

export default function AlertBox({ color, heading, children }: AlertBoxProps) {
  const colorStyles = {
    blue: {
      background: 'bg-blue-50',
      headingbg: 'bg-blue-800',
      heading: 'text-blue-50',
      border: 'border-blue-800'
    },
    green: {
      background: 'bg-green-50',
      headingbg: 'bg-green-800',
      heading: 'text-green-50',
      border: 'border-green-800'
    },
    red: {
      background: 'bg-red-50',
      headingbg: 'bg-red-700',
      heading: 'text-red-50',
      border: 'border-red-700'
    },
    yellow: {
      background: 'bg-yellow-50',
      headingbg: 'bg-yellow-800',
      heading: 'text-yellow-50',
      border: 'border-yellow-200'
    }, 
    gray: {
      background: 'bg-gray-50',
      headingbg: 'bg-gray-800',
      heading: 'text-gray-50',
      border: 'border-gray-800'
    }
  };

  const styles = colorStyles[color];

  return (
    <div className={`${styles.background} ${styles.border} border rounded-lg my-4`}>
      <div className={`${styles.headingbg} w-full px-4 py-3`}>
        <h4 className={`${styles.heading} text-center font-bold text-lg`}>
          {heading}
        </h4>
      </div>
      <div className="px-4 py-4 text-[15px] text-center">
        {children}
      </div>
    </div>
  );
}
