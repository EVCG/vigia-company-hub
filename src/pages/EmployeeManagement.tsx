
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { authService } from '@/services/authService';
import { useToast } from "@/hooks/use-toast";
import { User } from '@/types/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FormData = {
  fullName: string;
  email: string;
  whatsapp: string;
  password: string;
  isAdmin: boolean;
  role: 'gerente' | 'funcionario';
};

const EmployeeManagement: React.FC = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    whatsapp: '',
    password: '',
    isAdmin: false,
    role: 'funcionario'
  });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [employees, setEmployees] = useState<User[]>([]);

  // Get current admin user and company employees
  const currentUser = authService.getCurrentUser();

  // Carregar os funcionários ao montar o componente
  useEffect(() => {
    if (currentUser?.companyId) {
      const usersList = authService.getUsersByCompany(currentUser.companyId);
      setEmployees(usersList);
    }
  }, [currentUser?.companyId]);

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      whatsapp: '',
      password: '',
      isAdmin: false,
      role: 'funcionario'
    });
    setCurrentUserId(null);
    setIsEditMode(false);
  };

  const handleOpen = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRoleChange = (value: 'gerente' | 'funcionario') => {
    setFormData(prev => ({
      ...prev,
      role: value,
      isAdmin: value === 'gerente' // gerentes são admins
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    // Verificar se o WhatsApp já está em uso
    const isWhatsAppInUse = employees.some(
      employee => employee.whatsapp === formData.whatsapp && employee.id !== currentUserId
    );

    if (isWhatsAppInUse) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Este número de WhatsApp já está sendo usado por outro funcionário.",
      });
      return;
    }

    try {
      if (isEditMode && currentUserId) {
        // Update existing employee
        const updatedUser = {
          ...formData,
          id: currentUserId,
          companyId: currentUser.companyId,
          companyName: currentUser.companyName,
        };
        
        const success = authService.updateUser(currentUserId, updatedUser as User);
        
        if (success) {
          toast({
            title: "Sucesso",
            description: "Funcionário atualizado com sucesso.",
          });
          
          // Recarregar a lista de funcionários
          if (currentUser?.companyId) {
            const updatedList = authService.getUsersByCompany(currentUser.companyId);
            setEmployees(updatedList);
          }
          
          handleClose();
        } else {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Não foi possível atualizar o funcionário.",
          });
        }
      } else {
        // Add new employee
        const newUser = {
          ...formData,
          companyId: currentUser.companyId,
          companyName: currentUser.companyName,
          temporaryPassword: true, // Forçar mudança de senha no primeiro login
        };
        
        const success = authService.registerUser(newUser);
        
        if (success) {
          toast({
            title: "Sucesso",
            description: "Funcionário adicionado com sucesso. Senha temporária foi configurada.",
          });
          
          // Recarregar a lista de funcionários
          if (currentUser?.companyId) {
            const updatedList = authService.getUsersByCompany(currentUser.companyId);
            setEmployees(updatedList);
          }
          
          handleClose();
        } else {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Não foi possível adicionar o funcionário. O e-mail já pode estar em uso.",
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação.",
      });
    }
  };

  const handleEdit = (employee: User) => {
    setFormData({
      fullName: employee.fullName,
      email: employee.email,
      whatsapp: employee.whatsapp,
      password: '', // Não exibimos a senha atual por segurança
      isAdmin: employee.isAdmin,
      role: employee.isAdmin ? 'gerente' : 'funcionario'
    });
    setCurrentUserId(employee.id);
    setIsEditMode(true);
    setIsOpen(true);
  };

  const handleDelete = (userId: string) => {
    const success = authService.deleteUser(userId);
    
    if (success) {
      toast({
        title: "Sucesso",
        description: "Funcionário removido com sucesso.",
      });
      
      // Recarregar a lista de funcionários
      if (currentUser?.companyId) {
        const updatedList = authService.getUsersByCompany(currentUser.companyId);
        setEmployees(updatedList);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover o funcionário.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gerenciamento de Funcionários</h2>
        <Button onClick={handleOpen}>Adicionar Funcionário</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.fullName}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.whatsapp}</TableCell>
                    <TableCell>{employee.isAdmin ? 'Gerente' : 'Funcionário'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(employee)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o funcionário <strong>{employee.fullName}</strong>? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDelete(employee.id)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Nenhum funcionário cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Editar Funcionário' : 'Adicionar Funcionário'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Atualize os dados do funcionário abaixo.'
                : 'Preencha os dados para adicionar um novo funcionário. Uma senha temporária será gerada e o funcionário deverá alterá-la no primeiro login.'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="fullName">Nome Completo</label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email">E-mail</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="whatsapp">WhatsApp</label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {!isEditMode && (
                <div className="space-y-2">
                  <label htmlFor="password">Senha Temporária</label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!isEditMode}
                  />
                  <p className="text-xs text-gray-500">
                    O funcionário será solicitado a alterar esta senha no primeiro login.
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="role">Cargo</label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => handleRoleChange(value as 'gerente' | 'funcionario')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gerente">Gerente</SelectItem>
                    <SelectItem value="funcionario">Funcionário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditMode ? 'Salvar Alterações' : 'Adicionar Funcionário'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;
