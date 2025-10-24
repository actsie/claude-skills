import { CheckCircle2 } from 'lucide-react';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Verified badge component for GitHub-verified authors
 * Shows a checkmark icon with "Verified on GitHub" tooltip
 */
export default function VerifiedBadge({ size = 'sm', className = '' }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="relative inline-block group">
      <CheckCircle2
        className={`${sizeClasses[size]} ${className} text-gray-400 dark:text-gray-500 peer transition-all duration-200 hover:text-blue-400 hover:fill-blue-100 dark:hover:text-blue-400 dark:hover:fill-blue-900/30`}
        aria-label="Verified on GitHub"
      />

      {/* Tooltip */}
      <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 transition-all duration-200 ease-out transform group-hover:translate-y-0 translate-y-1 z-50 pointer-events-none">
        <div className="relative px-3 py-2 bg-white dark:bg-white backdrop-blur-md rounded-lg border border-gray-100 shadow-lg">
          <p className="text-xs text-gray-700 text-center font-medium">
            Verified on GitHub
          </p>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100"></div>
        </div>
      </div>
    </div>
  );
}
