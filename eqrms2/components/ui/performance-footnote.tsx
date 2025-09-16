import { MASTER_OPTIONS } from '@/lib/constants';

interface PerformanceFootnoteProps {
  className?: string;
  variant?: 'default' | 'small' | 'muted';
  additionalText?: string;
}

export function PerformanceFootnote({ 
  className = '', 
  variant = 'default',
  additionalText 
}: PerformanceFootnoteProps) {
  const performanceText = MASTER_OPTIONS.fundPerformanceAsOf[0];
  
  const variantStyles = {
    default: 'text-xs text-gray-600 mt-2',
    small: 'text-xs text-gray-500 mt-1',
    muted: 'text-xs text-gray-400 mt-1 italic'
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      {performanceText}
      {additionalText && ` ${additionalText}`}
    </div>
  );
}

// Convenience function for inline usage
export function getPerformanceFootnote(): string {
  return MASTER_OPTIONS.fundPerformanceAsOf[0];
}
