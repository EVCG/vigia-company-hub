
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-32 h-32',
  };

  return (
    <div className={`${sizes[size]} ${className} relative`}>
      <div className="bg-[url('/public/lovable-uploads/30896f5a-9872-4a4c-ae80-9f53a7474e15.png')] bg-cover bg-center w-full h-full"></div>
    </div>
  );
};

export default Logo;
