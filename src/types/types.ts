export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  whatsapp?: string;
  companyName?: string;  // Optional for when user belongs to existing company
  cnpj?: string;         // Optional for when user belongs to existing company
  companyId: string;
  isAdmin: boolean;
  createdAt: Date;
  temporaryPassword?: boolean; // Flag to indicate if password is temporary
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  createdAt: Date;
  employees: User[];  // Array of users that belong to this company
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
