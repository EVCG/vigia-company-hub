
import { User, Company } from '../types/types';

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

// Serviço de autenticação
export const authService = {
  // Usuário atual
  getCurrentUser: (): User | null => {
    return getFromLocalStorage<User>('currentUser');
  },

  // Obter todas as empresas
  getCompanies: (): Company[] => {
    return getFromLocalStorage<Company[]>('companies') || [];
  },

  // Obter todos os usuários
  getUsers: (): User[] => {
    return getFromLocalStorage<User[]>('users') || [];
  },

  // Registrar uma nova empresa e seu primeiro usuário administrativo
  registerCompany: (
    companyName: string,
    cnpj: string,
    fullName: string,
    email: string,
    whatsapp: string,
    password: string
  ): { success: boolean; message: string } => {
    try {
      const users = getFromLocalStorage<User[]>('users') || [];
      const companies = getFromLocalStorage<Company[]>('companies') || [];

      // Verificar se o email já existe
      if (users.some(user => user.email === email)) {
        return { success: false, message: 'Email já cadastrado' };
      }

      // Verificar se o CNPJ já existe
      if (companies.some(company => company.cnpj === cnpj)) {
        return { success: false, message: 'CNPJ já cadastrado' };
      }

      const companyId = `company-${Date.now()}`;
      const userId = `user-${Date.now()}`;

      // Criar a empresa
      const newCompany: Company = {
        id: companyId,
        name: companyName,
        cnpj,
        employees: [],
        createdAt: new Date()
      };

      // Criar o usuário administrador
      const newUser: User = {
        id: userId,
        fullName,
        email,
        whatsapp,
        companyId,
        companyName,
        password,
        isAdmin: true,
        createdAt: new Date(),
        requirePasswordChange: false
      };

      // Adicionar o usuário à empresa
      newCompany.employees.push(newUser);

      // Salvar empresa e usuário
      companies.push(newCompany);
      users.push(newUser);

      saveToLocalStorage('companies', companies);
      saveToLocalStorage('users', users);

      return { success: true, message: 'Empresa e usuário criados com sucesso' };
    } catch (error) {
      console.error('Erro ao registrar empresa:', error);
      return { success: false, message: 'Erro ao registrar empresa' };
    }
  },

  // Registrar um novo funcionário em uma empresa existente
  registerEmployee: (
    companyId: string,
    fullName: string,
    email: string,
    whatsapp: string,
    password: string
  ): { success: boolean; message: string } => {
    try {
      const users = getFromLocalStorage<User[]>('users') || [];
      const companies = getFromLocalStorage<Company[]>('companies') || [];

      // Verificar se o email já existe
      if (users.some(user => user.email === email)) {
        return { success: false, message: 'Email já cadastrado' };
      }

      // Verificar se a empresa existe
      const company = companies.find(company => company.id === companyId);
      if (!company) {
        return { success: false, message: 'Empresa não encontrada' };
      }

      const userId = `user-${Date.now()}`;

      // Criar o usuário
      const newUser: User = {
        id: userId,
        fullName,
        email,
        whatsapp,
        companyId,
        companyName: company.name,
        password,
        isAdmin: false,
        createdAt: new Date(),
        requirePasswordChange: true // Funcionários precisam alterar a senha no primeiro login
      };

      // Adicionar o usuário à empresa
      company.employees.push(newUser);
      users.push(newUser);

      saveToLocalStorage('companies', companies);
      saveToLocalStorage('users', users);

      return { success: true, message: 'Funcionário registrado com sucesso' };
    } catch (error) {
      console.error('Erro ao registrar funcionário:', error);
      return { success: false, message: 'Erro ao registrar funcionário' };
    }
  },

  // Login de usuário
  login: (email: string, password: string): { success: boolean; message: string; user?: User; requirePasswordChange?: boolean } => {
    try {
      const users = getFromLocalStorage<User[]>('users') || [];

      // Encontrar o usuário pelo email
      const user = users.find(user => user.email === email);
      if (!user) {
        return { success: false, message: 'Usuário não encontrado' };
      }

      // Verificar a senha
      if (user.password !== password) {
        return { success: false, message: 'Senha incorreta' };
      }

      // Salvar o usuário atual
      saveToLocalStorage('currentUser', user);

      return { 
        success: true, 
        message: 'Login realizado com sucesso', 
        user,
        requirePasswordChange: user.requirePasswordChange 
      };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { success: false, message: 'Erro ao fazer login' };
    }
  },

  // Atualizar senha do usuário
  updatePassword: (userId: string, newPassword: string): { success: boolean; message: string } => {
    try {
      const users = getFromLocalStorage<User[]>('users') || [];
      const companies = getFromLocalStorage<Company[]>('companies') || [];
      
      // Encontrar o usuário
      const userIndex = users.findIndex(user => user.id === userId);
      if (userIndex === -1) {
        return { success: false, message: 'Usuário não encontrado' };
      }
      
      // Atualizar a senha do usuário
      users[userIndex].password = newPassword;
      users[userIndex].requirePasswordChange = false;
      
      // Atualizar o usuário na empresa correspondente
      const companyIndex = companies.findIndex(company => company.id === users[userIndex].companyId);
      if (companyIndex !== -1) {
        const employeeIndex = companies[companyIndex].employees.findIndex(emp => emp.id === userId);
        if (employeeIndex !== -1) {
          companies[companyIndex].employees[employeeIndex].password = newPassword;
          companies[companyIndex].employees[employeeIndex].requirePasswordChange = false;
        }
      }
      
      // Atualizar o usuário atual se for o mesmo
      const currentUser = getFromLocalStorage<User>('currentUser');
      if (currentUser && currentUser.id === userId) {
        currentUser.password = newPassword;
        currentUser.requirePasswordChange = false;
        saveToLocalStorage('currentUser', currentUser);
      }
      
      // Salvar as alterações
      saveToLocalStorage('users', users);
      saveToLocalStorage('companies', companies);
      
      return { success: true, message: 'Senha atualizada com sucesso' };
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      return { success: false, message: 'Erro ao atualizar senha' };
    }
  },

  // Solicitar redefinição de senha
  requestPasswordReset: (email: string): { success: boolean; message: string } => {
    try {
      const users = getFromLocalStorage<User[]>('users') || [];
      
      // Encontrar o usuário pelo email
      const user = users.find(user => user.email === email);
      if (!user) {
        // Por segurança, não revelamos se o email existe ou não
        return { success: true, message: 'Se seu email estiver cadastrado, você receberá instruções para redefinir sua senha' };
      }
      
      // Em um sistema real, enviaríamos um email com um link para redefinir a senha
      // Aqui apenas simulamos o processo
      
      return { success: true, message: 'Se seu email estiver cadastrado, você receberá instruções para redefinir sua senha' };
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      return { success: false, message: 'Erro ao processar sua solicitação' };
    }
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('currentUser');
  },

  // Verificar se o usuário está autenticado
  isAuthenticated: (): boolean => {
    return !!getFromLocalStorage<User>('currentUser');
  }
};
