
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { authService } from '@/services/authService';
import { User } from '@/types/types';
import { Plus, UserX, Edit, Eye, EyeOff } from 'lucide-react';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [newEmployee, setNewEmployee] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Buscar funcionários da empresa atual
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const allUsers = authService.getUsers();
      const companyEmployees = allUsers.filter(user => user.companyId === currentUser.companyId);
      setEmployees(companyEmployees);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para adicionar funcionários.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Adicionar novo funcionário
    const result = authService.registerEmployee(
      currentUser.companyId,
      newEmployee.fullName,
      newEmployee.email,
      newEmployee.whatsapp,
      newEmployee.password
    );

    if (result.success) {
      toast({
        title: "Funcionário adicionado",
        description: result.message
      });
      
      // Atualizar a lista de funcionários
      const allUsers = authService.getUsers();
      const companyEmployees = allUsers.filter(user => user.companyId === currentUser.companyId);
      setEmployees(companyEmployees);
      
      // Limpar formulário
      setNewEmployee({
        fullName: '',
        email: '',
        whatsapp: '',
        password: ''
      });
      
      // Fechar o modal
      const closeButton = document.querySelector('[data-add-employee-close]');
      if (closeButton instanceof HTMLButtonElement) {
        closeButton.click();
      }
    } else {
      toast({
        title: "Erro",
        description: result.message,
        variant: "destructive"
      });
    }
    
    setIsSubmitting(false);
  };

  const formatWhatsapp = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica máscara (XX) XXXXX-XXXX
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsapp(e.target.value);
    setNewEmployee(prev => ({ ...prev, whatsapp: formatted }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento de Funcionários</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#006837] hover:bg-[#004d29]">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Funcionário</DialogTitle>
              <DialogDescription>
                Preencha os dados para adicionar um novo funcionário à sua empresa.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">Nome Completo</label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={newEmployee.fullName}
                  onChange={handleInputChange}
                  placeholder="Nome completo"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">E-mail</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  placeholder="email@empresa.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp</label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  value={newEmployee.whatsapp}
                  onChange={handleWhatsappChange}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Senha temporária</label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={newEmployee.password}
                    onChange={handleInputChange}
                    placeholder="Senha temporária"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  O funcionário será obrigado a alterar esta senha no primeiro acesso.
                </p>
              </div>
              
              <DialogFooter>
                <DialogClose data-add-employee-close asChild>
                  <Button type="button" variant="outline">Cancelar</Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#006837] hover:bg-[#004d29]"
                >
                  {isSubmitting ? "Adicionando..." : "Adicionar Funcionário"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Funcionários</CardTitle>
        </CardHeader>
        <CardContent>
          {employees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Nome</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">E-mail</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">WhatsApp</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Função</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{employee.fullName}</td>
                      <td className="py-3 px-4">{employee.email}</td>
                      <td className="py-3 px-4">{employee.whatsapp}</td>
                      <td className="py-3 px-4">{employee.isAdmin ? "Administrador" : "Funcionário"}</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!employee.isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Remover"
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">Nenhum funcionário encontrado</p>
              <p className="text-sm">Adicione funcionários à sua empresa usando o botão acima</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;
