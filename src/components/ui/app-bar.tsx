import React from 'react';

interface AppBarProps {
  maxWidthClass?: string;
  paddingXClass?: string;
  logoUrl?: string;
}

const AppBar = ({
  maxWidthClass = 'max-w-3xl',
  paddingXClass = 'px-6 sm:px-12',
  logoUrl,
}: AppBarProps) => {
  return (
    <div className={`w-full ${paddingXClass}`}>
      <div className={`mx-auto flex w-full items-center justify-start pt-16 sm:pt-8 ${maxWidthClass}`}>
        {/* Logo aligned to start (left) */}
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Brand Logo"
            className="h-8 sm:h-10 w-auto object-contain"
          />
        )}
      </div>
    </div>
  );
};

export default AppBar;
