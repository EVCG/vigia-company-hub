
export interface User {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  companyId: string;
  companyName: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  requirePasswordChange?: boolean;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  employees: User[];
  createdAt: Date;
}

export interface AlertMessage {
  id: string;
  title: string;
  content: string;
  type: 'urgent' | 'normal';
  createdAt: Date;
}

export interface SupportTicket {
  id: string;
  userId: string;
  problemDescription: string;
  status: 'pending' | 'sent' | 'resolved';
  createdAt: Date;
}

export interface MonitoringItem {
  id: string;
  title: string;
  source: string;
  portal: string;
  uasg: string;
  company: string;
  number: string;
  date: string;
  status: 'suspended' | 'closed' | 'active';
  message: string;
  value: number;
}
