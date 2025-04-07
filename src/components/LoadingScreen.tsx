
import React, { useEffect, useState } from 'react';
import Logo from './Logo';

interface LoadingScreenProps {
  minDuration?: number; // Duração mínima em milisegundos
  isLoading?: boolean;
  children: React.ReactNode;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  minDuration = 3000, 
  isLoading = false,
  children 
}) => {
  const [showLoading, setShowLoading] = useState(true);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Se não estiver carregando, começar o contador para esconder
    if (!isLoading) {
      timer = setTimeout(() => {
        setShowLoading(false);
      }, minDuration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, minDuration]);
  
  if (showLoading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="animate-bounce mb-8">
            <Logo size="lg" />
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-[#006837] mb-2 text-center">Carregando...</h2>
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#006837] animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default LoadingScreen;
