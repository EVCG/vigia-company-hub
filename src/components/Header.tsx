
import React, { useState, useEffect } from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { monitoringService } from '@/services/monitoringService';
import { MonitoringItem } from '@/types/types';

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [companyName, setCompanyName] = useState<string>("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  
  const auctions = monitoringService.getMonitoringItems();

  useEffect(() => {
    // Verificar se as notificações já foram lidas anteriormente
    const notificationsStatus = localStorage.getItem('notificationsRead');
    if (notificationsStatus === 'true') {
      setNotificationsRead(true);
    }

    // Obter o nome da empresa do usuário atual
    if (currentUser && currentUser.companyId) {
      const company = authService.getCurrentUserCompany();
      if (company) {
        setCompanyName(company.name);
      } else if (currentUser.companyName) {
        // Fallback para o companyName do usuário se não encontrar a empresa
        setCompanyName(currentUser.companyName);
      }
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleNotificationsOpen = () => {
    setIsNotificationsOpen(true);
    setNotificationsRead(true);
    // Salvar o estado de notificações lidas no localStorage
    localStorage.setItem('notificationsRead', 'true');
  };

  const handleNotificationClick = (item: MonitoringItem) => {
    setIsNotificationsOpen(false);
    // Redireciona para a página de monitor e armazena o item selecionado no localStorage
    localStorage.setItem('selectedMonitorItem', JSON.stringify(item));
    navigate('/monitor');
  };

  // Get status color class
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 py-2 px-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center">
        {children}
      </div>
      
      <div className="flex items-center">
        {currentUser && (
          <>
            {companyName && (
              <span className="text-sm font-medium text-gray-700 mr-4 hidden md:inline">
                Empresa: {companyName}
              </span>
            )}
            <span className="text-sm text-gray-600 mr-4 hidden md:inline">{currentUser.email}</span>
            
            <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 relative" onClick={handleNotificationsOpen}>
                  <Bell className="h-5 w-5" />
                  {auctions.length > 0 && !notificationsRead && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {auctions.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="font-medium px-4 py-2 border-b">Alertas de Pregões</div>
                <div className="max-h-[300px] overflow-y-auto">
                  {auctions.length > 0 ? (
                    auctions.map((auction) => (
                      <div 
                        key={auction.id} 
                        className="border-b py-2 px-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleNotificationClick(auction)}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{auction.number}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColorClass(auction.status)}`}>
                            {auction.status === 'active' ? 'Ativo' : 
                             auction.status === 'suspended' ? 'Suspenso' : 'Encerrado'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">{auction.company}</div>
                        <div className="text-xs text-gray-400">{auction.date}</div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-gray-500">
                      Nenhum pregão encontrado no momento.
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
