
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, AlertTriangle, XCircle } from 'lucide-react';
import { monitoringService } from '@/services/monitoringService';
import { MonitoringItem } from '@/types/types';

const Monitor: React.FC = () => {
  // Inicializar dados de exemplo
  React.useEffect(() => {
    monitoringService.initializeExampleData();
  }, []);

  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItem, setSelectedItem] = useState<MonitoringItem | null>(null);
  
  // Obter itens de monitoramento
  const allItems = monitoringService.getMonitoringItems();
  const suspendedItems = monitoringService.getMonitoringItemsByStatus('suspended');
  const closedItems = monitoringService.getMonitoringItemsByStatus('closed');
  
  // Filtrar itens de monitoramento com base na busca
  const filterItems = (items: MonitoringItem[]): MonitoringItem[] => {
    if (!searchTerm) return items;
    
    return items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.portal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.number.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  // Itens filtrados
  const filteredAll = filterItems(allItems);
  const filteredSuspended = filterItems(suspendedItems);
  const filteredClosed = filterItems(closedItems);
  
  // Helper para obter as cores de acordo com o status
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
  
  const getStatusBgClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50';
      case 'suspended':
        return 'bg-yellow-50';
      case 'closed':
        return 'bg-red-50';
      default:
        return '';
    }
  };
  
  // Renderiza um item na lista de suspensos/encerrados
  const renderItem = (item: MonitoringItem) => (
    <div 
      key={item.id} 
      className={`border-b py-2 hover:bg-gray-50 cursor-pointer ${selectedItem?.id === item.id ? 'bg-gray-100' : ''}`}
      onClick={() => setSelectedItem(item)}
    >
      <div className="grid grid-cols-3 gap-1">
        <div className="font-medium">{item.source}</div>
        <div>{item.date}</div>
        <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">{item.message}</div>
      </div>
    </div>
  );
  
  // Função para encontrar um pregão nas listas quando selecionado de Suspensos/Encerrados
  const handleListItemClick = (item: MonitoringItem) => {
    setSelectedItem(item);
    // Rolar até o topo da página em dispositivos móveis
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Cabeçalho e pesquisa */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-500">
                <div>Número</div>
                <div>Órgão</div>
                <div>Data</div>
                <div>Status</div>
              </div>
              
              {filteredAll.length > 0 ? (
                filteredAll.map(item => (
                  <div 
                    key={item.id} 
                    className={`grid grid-cols-4 gap-2 text-sm py-1 border-t cursor-pointer hover:bg-gray-50 ${selectedItem?.id === item.id ? 'bg-gray-100' : ''} ${getStatusBgClass(item.status)}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div>{item.number}</div>
                    <div className="truncate">{item.company}</div>
                    <div>{item.date}</div>
                    <div className={`font-medium ${
                      item.status === 'suspended' ? 'text-yellow-500' : 
                      item.status === 'closed' ? 'text-red-500' : 
                      'text-green-500'
                    }`}>
                      {item.status === 'suspended' ? 'Suspenso' : 
                       item.status === 'closed' ? 'Encerrado' : 
                       'Ativo'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>Nenhum pregão encontrado no momento!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Detalhes do pregão */}
        <Card className="lg:col-span-2">
          <CardHeader className={`p-4 border-b ${selectedItem ? getStatusBgClass(selectedItem.status) : ''}`}>
            {selectedItem ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Número</div>
                  <div className="font-medium">{selectedItem.number}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Portal</div>
                  <div className="font-medium">{selectedItem.portal}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">UASG/UF</div>
                  <div className="font-medium">{selectedItem.uasg}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Órgão</div>
                  <div className="font-medium">{selectedItem.company}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Empresa</div>
                  <div className="font-medium">-</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div className={`font-medium ${
                    selectedItem.status === 'suspended' ? 'text-yellow-500' : 
                    selectedItem.status === 'closed' ? 'text-red-500' : 
                    'text-green-500'
                  }`}>
                    {selectedItem.status === 'suspended' ? 'Suspenso' : 
                     selectedItem.status === 'closed' ? 'Encerrado' : 
                     'Ativo'}
                  </div>
                </div>
                <div className="col-span-1 md:col-span-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-xs font-medium text-center">Origem</div>
                    <div className="text-xs font-medium text-center">Data</div>
                    <div className="text-xs font-medium text-center">Mensagem</div>
                  </div>
                  <div className={`px-2 py-1 rounded mt-1 grid grid-cols-3 text-xs ${getStatusColorClass(selectedItem.status)}`}>
                    <div className="text-center">{selectedItem.source}</div>
                    <div className="text-center">{selectedItem.date}</div>
                    <div className="truncate">{selectedItem.message}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Número</div>
                  <div className="font-medium">-</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Portal</div>
                  <div className="font-medium">-</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">UASG/UF</div>
                  <div className="font-medium">-</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Órgão</div>
                  <div className="font-medium">-</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Empresa</div>
                  <div className="font-medium">-</div>
                </div>
                <div></div>
                <div className="col-span-1 md:col-span-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-xs font-medium text-center">Origem</div>
                    <div className="text-xs font-medium text-center">Data</div>
                    <div className="text-xs font-medium text-center">Mensagem</div>
                  </div>
                  <div className="bg-gray-100 px-2 py-1 rounded mt-1 grid grid-cols-3 text-xs">
                    <div className="text-center">-</div>
                    <div className="text-center">-</div>
                    <div className="truncate">-</div>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-4 h-64 flex items-center justify-center">
            {selectedItem ? (
              <div className="w-full">
                <h3 className="font-medium text-lg mb-4">Detalhes do Pregão</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Valor Estimado:</div>
                    <div className="text-sm">R$ {selectedItem.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Título:</div>
                    <div className="text-sm">{selectedItem.title}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Mensagem:</div>
                    <div className="text-sm">{selectedItem.message}</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Nenhum pregão selecionado no momento!</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Pregões Suspensos e Encerrados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pregões Suspensos */}
        <Card>
          <CardHeader className="p-4 bg-yellow-100 border-b border-yellow-200 flex flex-row items-center space-y-0">
            <AlertTriangle className="text-yellow-500 mr-2" size={20} />
            <CardTitle className="text-base font-medium text-yellow-700">PREGÕES SUSPENSOS</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-64 overflow-y-auto">
            {filteredSuspended.length > 0 ? (
              filteredSuspended.map(item => (
                <div 
                  key={item.id} 
                  className="border-b py-2 hover:bg-yellow-50 cursor-pointer"
                  onClick={() => handleListItemClick(item)}
                >
                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">{item.source}</div>
                    <div>{item.date}</div>
                    <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">{item.message}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p>Nenhum pregão encontrado no momento!</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Pregões Encerrados */}
        <Card>
          <CardHeader className="p-4 bg-red-100 border-b border-red-200 flex flex-row items-center space-y-0">
            <XCircle className="text-red-500 mr-2" size={20} />
            <CardTitle className="text-base font-medium text-red-700">PREGÕES ENCERRADOS</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-64 overflow-y-auto">
            {filteredClosed.length > 0 ? (
              filteredClosed.map(item => (
                <div 
                  key={item.id} 
                  className="border-b py-2 hover:bg-red-50 cursor-pointer"
                  onClick={() => handleListItemClick(item)}
                >
                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">{item.source}</div>
                    <div>{item.date}</div>
                    <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">{item.message}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p>Nenhum pregão encontrado no momento!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Monitor;
