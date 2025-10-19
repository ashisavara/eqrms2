interface InfoCardProps {
  image?: string;
  headline?: string;
  children?: React.ReactNode;
  colorStyle?: 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'purple';
}

export default function InfoCard({ image, headline, children, colorStyle = 'gray' }: InfoCardProps) {
  const colorStyles = {
    blue: {
      background: 'bg-blue-50',
      border: 'border-blue-200',
      headline: 'text-blue-800',
      text: 'text-blue-700'
    },
    green: {
      background: 'bg-green-50',
      border: 'border-green-200',
      headline: 'text-green-800',
      text: 'text-green-700'
    },
    red: {
      background: 'bg-red-50',
      border: 'border-red-200',
      headline: 'text-red-800',
      text: 'text-red-700'
    },
    yellow: {
      background: 'bg-yellow-50',
      border: 'border-yellow-200',
      headline: 'text-yellow-800',
      text: 'text-yellow-700'
    },
    gray: {
      background: 'bg-gray-50',
      border: 'border-gray-200',
      headline: 'text-gray-800',
      text: 'text-gray-700'
    },
    purple: {
      background: 'bg-purple-50',
      border: 'border-purple-200',
      headline: 'text-purple-800',
      text: 'text-purple-700'
    }
  };

  const styles = colorStyles[colorStyle];

  return (
    <div className={`p-4 ${styles.background} ${styles.border} border rounded-lg shadow-sm`}>
      {/* Image */}
      {image && (
        <div className="mb-3 flex justify-center">
          <img
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog${image}`}
            alt={headline || 'Card image'}
            className="w-12 h-12"
          />
        </div>
      )}
      
      {/* Headline */}
      {headline && (
        <h4 className={`text-lg font-bold mb-2 text-center ${styles.headline}`}>
          {headline}
        </h4>
      )}
      
      {/* Content */}
      {children && (
        <div className={`text-sm ${styles.text}`}>
          {children}
        </div>
      )}
    </div>
  );
}
