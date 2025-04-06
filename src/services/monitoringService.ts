
import { MonitoringItem, AlertMessage, SupportTicket } from '../types/types';

// Função para salvar dados no localStorage
const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
};

// Função para obter dados do localStorage
const getFromLocalStorage = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erro ao obter do localStorage:', error);
    return null;
  }
};

// Serviço de monitoramento
export const monitoringService = {
  // Obter todos os itens de monitoramento
  getMonitoringItems: (): MonitoringItem[] => {
    return getFromLocalStorage<MonitoringItem[]>('monitoringItems') || [];
  },

  // Adicionar um novo item de monitoramento
  addMonitoringItem: (item: Omit<MonitoringItem, 'id'>): MonitoringItem => {
    const monitoringItems = getFromLocalStorage<MonitoringItem[]>('monitoringItems') || [];
    const newItem = { ...item, id: `item-${Date.now()}` };
    monitoringItems.push(newItem);
    saveToLocalStorage('monitoringItems', monitoringItems);
    return newItem;
  },

  // Atualizar um item de monitoramento
  updateMonitoringItem: (id: string, item: Partial<MonitoringItem>): boolean => {
    const monitoringItems = getFromLocalStorage<MonitoringItem[]>('monitoringItems') || [];
    const index = monitoringItems.findIndex(i => i.id === id);
    if (index === -1) return false;
    monitoringItems[index] = { ...monitoringItems[index], ...item };
    saveToLocalStorage('monitoringItems', monitoringItems);
    return true;
  },

  // Remover um item de monitoramento
  removeMonitoringItem: (id: string): boolean => {
    const monitoringItems = getFromLocalStorage<MonitoringItem[]>('monitoringItems') || [];
    const newItems = monitoringItems.filter(item => item.id !== id);
    if (newItems.length === monitoringItems.length) return false;
    saveToLocalStorage('monitoringItems', newItems);
    return true;
  },

  // Obter itens de monitoramento por status
  getMonitoringItemsByStatus: (status: 'suspended' | 'closed' | 'active'): MonitoringItem[] => {
    const monitoringItems = getFromLocalStorage<MonitoringItem[]>('monitoringItems') || [];
    return monitoringItems.filter(item => item.status === status);
  },

  // Alertas
  getAlerts: (): AlertMessage[] => {
    return getFromLocalStorage<AlertMessage[]>('alerts') || [];
  },

  // Adicionar um novo alerta
  addAlert: (alert: Omit<AlertMessage, 'id' | 'createdAt'>): AlertMessage => {
    const alerts = getFromLocalStorage<AlertMessage[]>('alerts') || [];
    const newAlert = { ...alert, id: `alert-${Date.now()}`, createdAt: new Date() };
    alerts.push(newAlert);
    saveToLocalStorage('alerts', alerts);
    return newAlert;
  },

  // Suporte
  getSupportTickets: (): SupportTicket[] => {
    return getFromLocalStorage<SupportTicket[]>('supportTickets') || [];
  },

  // Adicionar um novo ticket de suporte
  addSupportTicket: (userId: string, problemDescription: string): SupportTicket => {
    const supportTickets = getFromLocalStorage<SupportTicket[]>('supportTickets') || [];
    const newTicket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      userId,
      problemDescription,
      status: 'pending',
      createdAt: new Date()
    };
    supportTickets.push(newTicket);
    saveToLocalStorage('supportTickets', supportTickets);
    return newTicket;
  },

  // Atualizar o status de um ticket de suporte
  updateSupportTicketStatus: (id: string, status: 'pending' | 'sent' | 'resolved'): boolean => {
    const supportTickets = getFromLocalStorage<SupportTicket[]>('supportTickets') || [];
    const index = supportTickets.findIndex(ticket => ticket.id === id);
    if (index === -1) return false;
    supportTickets[index].status = status;
    saveToLocalStorage('supportTickets', supportTickets);
    return true;
  },

  // Inicializar dados de exemplo
  initializeExampleData: (): void => {
    // Adicionar alguns dados de exemplo para monitoramento
    if (!getFromLocalStorage('monitoringItems')) {
      const exampleItems: MonitoringItem[] = [
        {
          id: 'item-1',
          title: 'Pregão Eletrônico',
          source: 'ComprasNet',
          portal: 'ComprasNet',
          uasg: '853000',
          company: 'MINISTÉRIO DA ECONOMIA',
          number: '76/2023',
          date: '15/03/2024',
          status: 'suspended',
          message: 'O edital foi suspenso para retificação conforme decisão da administração',
          value: 185000
        },
        {
          id: 'item-2',
          title: 'Pregão Eletrônico',
          source: 'ComprasNet',
          portal: 'ComprasNet',
          uasg: '160100',
          company: 'EXÉRCITO BRASILEIRO',
          number: '45/2024',
          date: '20/03/2024',
          status: 'active',
          message: 'O pregão está em andamento',
          value: 267500
        },
        {
          id: 'item-3',
          title: 'Pregão Eletrônico',
          source: 'ComprasNet',
          portal: 'ComprasNet',
          uasg: '200005',
          company: 'MINISTÉRIO DA JUSTIÇA',
          number: '32/2024',
          date: '18/03/2024',
          status: 'closed',
          message: 'O pregão foi encerrado',
          value: 124000
        }
      ];
      saveToLocalStorage('monitoringItems', exampleItems);
    }

    // Adicionar alguns alertas de exemplo
    if (!getFromLocalStorage('alerts')) {
      const exampleAlerts: AlertMessage[] = [
        {
          id: 'alert-1',
          title: 'URGENTE',
          content: 'SUSPENSÃO DE LICITAÇÃO',
          type: 'urgent',
          createdAt: new Date()
        },
        {
          id: 'alert-2',
          title: 'Novo Edital',
          content: 'Novo edital publicado - UASG 160100',
          type: 'normal',
          createdAt: new Date()
        }
      ];
      saveToLocalStorage('alerts', exampleAlerts);
    }
  }
};
