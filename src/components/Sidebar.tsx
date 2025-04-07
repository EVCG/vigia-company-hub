
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Search, FileText, HeadphonesIcon, UserPlus } from 'lucide-react';

interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false }) => {
  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-[#006837] text-white flex flex-col z-10">
      <div className="flex flex-col items-center justify-between pt-4 h-full">
        <div className="flex flex-col items-center space-y-6">
          {/* Links de navegação */}
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `w-10 h-10 flex items-center justify-center rounded-md transition-colors duration-200 ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
            }
            title="Dashboard"
          >
            <BarChart3 className="w-6 h-6" />
          </NavLink>

          <NavLink 
            to="/monitor" 
            className={({ isActive }) => 
              `w-10 h-10 flex items-center justify-center rounded-md transition-colors duration-200 ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
            }
            title="Monitor"
          >
            <Search className="w-6 h-6" />
          </NavLink>

          <NavLink 
            to="/report" 
            className={({ isActive }) => 
              `w-10 h-10 flex items-center justify-center rounded-md transition-colors duration-200 ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
            }
            title="Relatórios"
          >
            <FileText className="w-6 h-6" />
          </NavLink>

          <NavLink 
            to="/support" 
            className={({ isActive }) => 
              `w-10 h-10 flex items-center justify-center rounded-md transition-colors duration-200 ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
            }
            title="Suporte"
          >
            <HeadphonesIcon className="w-6 h-6" />
          </NavLink>
          
          {/* Link para gerenciamento de funcionários (apenas para admin) */}
          {isAdmin && (
            <NavLink 
              to="/employee-management" 
              className={({ isActive }) => 
                `w-10 h-10 flex items-center justify-center rounded-md transition-colors duration-200 ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
              }
              title="Gerenciar Funcionários"
            >
              <UserPlus className="w-6 h-6" />
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
