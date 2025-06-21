import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { authService } from '@/services/authService';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const MainLayout: React.FC = () => {
  // State para controlar sidebar em telas menores
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Verificar se o usuário está autenticado
  // const currentUser = authService.getCurrentUser();
  
  // if (!currentUser) {
  //   return <Navigate to="/login" />;
  // }

  // Verificar se o usuário é admin para determinar acesso à página de funcionários
  // const isAdmin = currentUser.isAdmin;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setSidebarOpen(false)}
      />
           
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-30 md:relative md:z-0`}
      >
        {/* isAdmin={isAdmin} */}
        <Sidebar  />
      </div>
      
      <div className="flex-1 md:ml-16 flex flex-col">
        <Header>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden mr-2" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </Header>
        <main className="flex-grow p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
