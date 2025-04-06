
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

    // Se temos informações da empresa, vamos criar/verificar a empresa primeiro
    let companyId = "";
    if (user.companyName && user.cnpj) {
      companyId = registerCompany({
        name: user.companyName,
        cnpj: user.cnpj
      });
      
      if (!companyId) return false;
    }

    const newUser: User = {
      id: generateId(),
      ...user,
      companyId: companyId, // Usar o ID da empresa criada ou vazia se não houver
      password: user.password || 'padrao123', // Senha padrão
      createdAt: new Date()
    };
    users.push(newUser);
    saveToLocalStorage('users', users);
    
    // Se for o primeiro login, definir como usuário atual
    if (users.length === 1) {
      setCurrentUser(newUser);
    }
    return true;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return false;
  }
};

// Função para registrar uma empresa
const registerCompany = (companyData: { name: string; cnpj: string }): string => {
  try {
    const companies = getCompanies();
    
    // Verificar se o CNPJ já está cadastrado
    const existingCompany = companies.find(c => c.cnpj === companyData.cnpj);
    if (existingCompany) {
      return existingCompany.id; // Retorna o ID da empresa existente
    }
    
    // Criar nova empresa
    const newCompany: Company = {
      id: generateId(),
      name: companyData.name,
      cnpj: companyData.cnpj,
      createdAt: new Date()
    };
    
    companies.push(newCompany);
    saveToLocalStorage('companies', companies);
    
    return newCompany.id;
  } catch (error) {
    console.error('Erro ao registrar empresa:', error);
    return "";
  }
};

// Função para atualizar senha
const updatePassword = (userId: string, newPassword: string): boolean => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return false;
    
    users[userIndex].password = newPassword;
    users[userIndex].temporaryPassword = false; // Marca como senha permanente
    
    saveToLocalStorage('users', users);
    
    // Atualizar o usuário atual se necessário
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(users[userIndex]);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    return false;
  }
};

// Função para autenticar um usuário
const login = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(user => user.email === email && user.password === password);
  
  if (user) {
    // Salvar o usuário atual no localStorage
    setCurrentUser(user);
  }
  
  return user;
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
    
    // Atualizar o usuário atual se necessário
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(users[userIndex]);
    }
    
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
  registerCompany,
  login,
  logout,
  getCurrentUser,
  setCurrentUser,
  getUsersByCompany,
  updateUser,
  deleteUser,
  updatePassword
};
