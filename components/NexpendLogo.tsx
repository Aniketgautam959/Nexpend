import React from 'react';

interface NexpendLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const NexpendLogo: React.FC<NexpendLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${sizeClasses[size]} bg-accent rounded-lg flex items-center justify-center shadow-[0_0_16px_rgba(34,197,94,0.35)]`}
      >
        <svg
          className='w-1/2 h-1/2 text-accent-foreground'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2.5'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 3v18M5 10l7-7 7 7' />
        </svg>
      </div>

      {showText && (
        <span
          className={`${textSizeClasses[size]} font-semibold tracking-tight text-zinc-900 dark:text-white`}
        >
          Nexpend
        </span>
      )}
    </div>
  );
};

export default NexpendLogo;
