
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
      <div className="bg-[url('/lovable-uploads/59f3a138-d3c1-4cb0-afb9-7b80177d79b6.png')] bg-cover bg-center w-full h-full"></div>
    </div>
  );
};

export default Logo;
