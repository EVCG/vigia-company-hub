
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Activity, BarChart2, HelpCircle, Menu, X } from 'lucide-react';
import Logo from './Logo';
import { cn } from '@/lib/utils';
import { authService } from '@/services/authService';

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const currentUser = authService.getCurrentUser();

  const menuItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Monitorar', path: '/monitor', icon: Activity },
    { name: 'Relatório', path: '/report', icon: BarChart2 },
    { name: 'Suporte', path: '/support', icon: HelpCircle }
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={cn(
      'fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40',
      isExpanded ? 'w-60' : 'w-16'
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-primary p-1 focus:outline-none">
            {isExpanded ? <X size={20} /> : <Menu size={20} />}
          </button>
          {isExpanded && (
            <div className="flex items-center">
              <Logo size="sm" />
              <span className="ml-2 text-primary font-semibold">VIGIA - ALERTANDO VOCÊ</span>
            </div>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center py-2 px-2 rounded-md transition-colors',
                    location.pathname === item.path
                      ? 'bg-accent text-primary font-medium'
                      : 'text-gray-600 hover:bg-gray-100',
                    !isExpanded && 'justify-center'
                  )}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {isExpanded && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {isExpanded && currentUser && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="ml-2 overflow-hidden">
                <p className="text-sm font-medium truncate">{currentUser.fullName}</p>
                <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
