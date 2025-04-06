import { User, Company } from '../types/types';

// Função para gerar um ID único
const generateId = (): string => {
  return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

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

// Função para obter todos os usuários
const getUsers = (): User[] => {
  return getFromLocalStorage<User[]>('users') || [];
};

// Função para obter todas as empresas
const getCompanies = (): Company[] => {
  return getFromLocalStorage<Company[]>('companies') || [];
};

// Função para simular o registro de um usuário
const registerUser = (user: Omit<User, 'id' | 'createdAt'>): boolean => {
  try {
    const users = getUsers();
    // Verificar se o email já está cadastrado
    if (users.find(u => u.email === user.email)) {
      console.log('Email já cadastrado');
      return false;
    }

    const newUser: User = {
      id: generateId(),
      ...user,
      password: user.password || 'padrao123', // Senha padrão
      createdAt: new Date()
    };
    users.push(newUser);
    saveToLocalStorage('users', users);
    return true;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return false;
  }
};

// Função para autenticar um usuário
const login = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(user => user.email === email && user.password === password);
  return user || null;
};

// Função para fazer logout (simplesmente remove o usuário do localStorage)
const logout = (): void => {
  localStorage.removeItem('currentUser');
};

// Função para obter o usuário atualmente logado
const getCurrentUser = (): User | null => {
  return getFromLocalStorage<User>('currentUser');
};

// Função para definir o usuário atualmente logado
const setCurrentUser = (user: User): void => {
  saveToLocalStorage('currentUser', user);
};

// Função para obter usuários por CompanyId
const getUsersByCompany = (companyId: string): User[] => {
  const users = getUsers();
  return users.filter(user => user.companyId === companyId);
};

// Adicionar função para atualizar usuário
const updateUser = (userId: string, userData: Partial<User>): boolean => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) return false;
    
    // Atualizar o usuário
    users[userIndex] = { ...users[userIndex], ...userData };
    
    // Salvar alterações
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return false;
  }
};

// Adicionar função para excluir usuário
const deleteUser = (userId: string): boolean => {
  try {
    let users = getUsers();
    const userToDelete = users.find(user => user.id === userId);
    
    if (!userToDelete) return false;
    
    // Remover usuário
    users = users.filter(user => user.id !== userId);
    
    // Salvar alterações
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return false;
  }
};

export const authService = {
  registerUser,
  login,
  logout,
  getCurrentUser,
  setCurrentUser,
  getUsersByCompany,
  updateUser,
  deleteUser,
};
