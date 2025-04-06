
import React, { useState } from 'react';
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
  
  // Renderiza um item
  const renderItem = (item: MonitoringItem) => (
    <div key={item.id} className="border-b py-2">
      <div className="grid grid-cols-3 gap-1">
        <div className="font-medium">{item.source}</div>
        <div>{item.date}</div>
        <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">{item.message}</div>
      </div>
    </div>
  );
  
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
                  <div key={item.id} className="grid grid-cols-4 gap-2 text-sm py-1 border-t">
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
          <CardHeader className="p-4 border-b">
            <div className="grid grid-cols-3 gap-4">
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
              <div className="col-span-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-xs font-medium text-center">Origem</div>
                  <div className="text-xs font-medium text-center">Data</div>
                  <div className="text-xs font-medium text-center">Mensagem</div>
                </div>
                <div className="bg-green-100 px-2 py-1 rounded mt-1 grid grid-cols-3 text-xs">
                  <div className="text-center">ComprasNet</div>
                  <div className="text-center">-</div>
                  <div className="truncate">-</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 h-64 flex items-center justify-center">
            <p className="text-gray-400">Nenhum pregão encontrado no momento!</p>
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
              filteredSuspended.map(item => renderItem(item))
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
              filteredClosed.map(item => renderItem(item))
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
