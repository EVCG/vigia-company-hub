
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { authService } from '@/services/authService';

const MainLayout: React.FC = () => {
  // Verificar se o usuário está autenticado
  const currentUser = authService.getCurrentUser();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Verificar se o usuário é admin para determinar acesso à página de funcionários
  const isAdmin = currentUser.isAdmin;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex-1 ml-16">
        <Header />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
