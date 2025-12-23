import React from 'react';

interface AppBarProps {
  onBack?: () => void;
  showBackButton?: boolean;
  maxWidthClass?: string;
  paddingXClass?: string;
  logoUrl?: string;
}

const AppBar = ({
  onBack,
  showBackButton = true,
  maxWidthClass = 'max-w-3xl',
  paddingXClass = 'px-6 sm:px-12',
  logoUrl,
}: AppBarProps) => {
  return (
    <div className="w-full">
      <div className={`mx-auto flex w-full items-center justify-between pt-8 ${maxWidthClass} ${paddingXClass}`}>
        {/* Logo */}
        <div className="flex items-center gap-4">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Brand Logo"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          )}
        </div>

        {/* Back Button */}
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="rounded-full border border-gray-700 bg-transparent p-1.5 text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-colors"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AppBar;
