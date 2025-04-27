import React, { useState } from 'react';
import { sendResetCode } from "../services/sendResetCode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const trimmedEmail = email.trim();

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um e-mail válido antes de enviar.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await sendResetCode(trimmedEmail);

      toast({
        title: "E-mail enviado",
        description: `Foi enviado um código de redefinição para ${trimmedEmail}.`,
        duration: 5000,
      });

      onClose(); // Fechar modal após sucesso
      setEmail('');
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro ao enviar",
        description: error?.message || 'Erro inesperado ao enviar o e-mail.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recuperação de Senha</DialogTitle>
          <DialogDescription>
            Digite seu e-mail abaixo e enviaremos instruções para redefinir sua senha.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">E-mail</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              placeholder="seu.email@exemplo.com"
              required
              autoComplete="email"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="bg-[#006837] hover:bg-[#004d29]"
            >
              {isSubmitting ? "Enviando..." : "Enviar Instruções"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordModal;
