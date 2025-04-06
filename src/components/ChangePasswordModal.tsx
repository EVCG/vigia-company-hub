
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { User } from '@/types/types';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  isTemporaryPassword?: boolean;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  userId,
  isTemporaryPassword = false
}) => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validatePasswords = () => {
    if (!isTemporaryPassword && !currentPassword) {
      toast({
        title: 'Senha atual obrigatória',
        description: 'Por favor, digite sua senha atual.',
        variant: 'destructive',
      });
      return false;
    }

    if (!newPassword || newPassword.length < 6) {
      toast({
        title: 'Nova senha inválida',
        description: 'A nova senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'As senhas não coincidem',
        description: 'A nova senha e a confirmação devem ser idênticas.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) {
      return;
    }

    setIsSubmitting(true);
    
    if (!isTemporaryPassword) {
      // Verificar a senha atual antes de permitir a alteração
      const currentUser = authService.getCurrentUser() as User;
      if (currentUser && currentUser.password !== currentPassword) {
        toast({
          title: 'Senha atual incorreta',
          description: 'A senha atual está incorreta.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
    }
    
    // Atualizar a senha
    const result = authService.updatePassword(userId, newPassword);
    
    if (result.success) {
      toast({
        title: 'Senha alterada com sucesso',
        description: 'Sua nova senha foi configurada.',
      });
      handleClose();
    } else {
      toast({
        title: 'Erro ao alterar senha',
        description: result.message || 'Ocorreu um erro ao atualizar sua senha.',
        variant: 'destructive',
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Senha</DialogTitle>
          <DialogDescription>
            {isTemporaryPassword 
              ? 'Por favor, defina uma nova senha para sua conta.' 
              : 'Digite sua senha atual e escolha uma nova senha.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isTemporaryPassword && (
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required={!isTemporaryPassword}
                disabled={isSubmitting}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isSubmitting}
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
