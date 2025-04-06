
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Search, FileText, HeadphonesIcon, LogOut, UserPlus } from 'lucide-react';
import { authService } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';

interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Logout",
      description: "Você saiu do sistema com sucesso",
    });
    navigate('/login');
  };

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-[#006837] text-white flex flex-col justify-between z-10">
      <div className="flex flex-col items-center pt-4 space-y-6">
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

      {/* Botão de logout */}
      <div className="mb-6 flex justify-center">
        <button 
          onClick={handleLogout}
          className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors duration-200"
          title="Sair"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
