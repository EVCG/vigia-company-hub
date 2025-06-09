
import React, { useState, useEffect } from 'react';
import { sendResetCode } from "../services/sendResetCode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from "@/components/ui/use-toast";
import { Timer, Eye, EyeOff, CheckCircle } from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ResetStep = 'email' | 'code' | 'password' | 'success';

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<ResetStep>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutos
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  // Timer para o código OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsTimerActive(false);
            toast({
              title: "Código expirado",
              description: "O código de verificação expirou. Solicite um novo código.",
              variant: "destructive",
            });
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
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
      const generatedCode = generateCode();
      setSentCode(generatedCode);
      
      await sendResetCode(trimmedEmail);
      console.log('Código gerado para teste:', generatedCode);

      toast({
        title: "Código enviado",
        description: `Foi enviado um código de verificação para ${trimmedEmail}.`,
      });

      setStep('code');
      setTimeLeft(120);
      setIsTimerActive(true);
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

  const handleCodeVerification = async () => {
    if (code.length !== 6) {
      toast({
        title: "Código inválido",
        description: "Por favor, digite o código de 6 dígitos.",
        variant: "destructive",
      });
      return;
    }

    if (timeLeft <= 0) {
      toast({
        title: "Código expirado",
        description: "O código de verificação expirou. Solicite um novo código.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular verificação do código
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (code === sentCode) {
        setIsTimerActive(false);
        setStep('password');
        toast({
          title: "Código verificado!",
          description: "Agora defina sua nova senha.",
        });
      } else {
        toast({
          title: "Código inválido",
          description: "O código digitado não confere. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao verificar código. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Mínimo de 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Uma letra maiúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Uma letra minúscula');
    }
    if (!/\d/.test(password)) {
      errors.push('Um número');
    }
    
    return errors;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordErrors = validatePassword(newPassword);
    
    if (passwordErrors.length > 0) {
      toast({
        title: "Senha inválida",
        description: `A senha deve conter: ${passwordErrors.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "As senhas digitadas não são iguais.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular atualização da senha no banco de dados
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Atualizando senha para o email:', email);
      console.log('Nova senha:', newPassword);
      
      setStep('success');
      toast({
        title: "Senha atualizada!",
        description: "Sua senha foi redefinida com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao redefinir senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setCode('');
    setSentCode('');
    setNewPassword('');
    setConfirmPassword('');
    setStep('email');
    setIsSubmitting(false);
    setTimeLeft(120);
    setIsTimerActive(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const renderContent = () => {
    switch (step) {
      case 'email':
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                disabled={isSubmitting}
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="flex-1 bg-[#006837] hover:bg-[#004d29]"
              >
                {isSubmitting ? "Enviando..." : "Enviar Código"}
              </Button>
            </div>
          </form>
        );

      case 'code':
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Digite o código de 6 dígitos enviado para:
              </p>
              <p className="font-medium">{email}</p>
              
              <div className="flex items-center justify-center space-x-2 text-sm">
                <Timer className="h-4 w-4 text-orange-500" />
                <span className={timeLeft <= 30 ? "text-red-500 font-medium" : "text-muted-foreground"}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <InputOTP 
                maxLength={6} 
                value={code} 
                onChange={setCode}
                disabled={isSubmitting || timeLeft <= 0}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleCodeVerification}
                className="w-full bg-[#006837] hover:bg-[#004d29]"
                disabled={isSubmitting || code.length !== 6 || timeLeft <= 0}
              >
                {isSubmitting ? 'Verificando...' : 'Verificar Código'}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setStep('email')}
                className="w-full"
                disabled={isSubmitting}
              >
                Voltar
              </Button>
            </div>
          </div>
        );

      case 'password':
        const passwordErrors = validatePassword(newPassword);
        
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">
                Defina uma nova senha segura para sua conta
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium">
                Nova Senha
              </label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pr-10"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              
              {newPassword && passwordErrors.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <p>A senha deve conter:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {passwordErrors.map((error, index) => (
                      <li key={index} className="text-red-500">{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pr-10"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              
              {confirmPassword && 
               newPassword !== confirmPassword && (
                <p className="text-xs text-red-500">
                  As senhas não conferem
                </p>
              )}
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep('code')}
                className="flex-1"
                disabled={isSubmitting}
              >
                Voltar
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-[#006837] hover:bg-[#004d29]"
                disabled={isSubmitting || passwordErrors.length > 0 || 
                         newPassword !== confirmPassword}
              >
                {isSubmitting ? 'Atualizando...' : 'Redefinir Senha'}
              </Button>
            </div>
          </form>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Senha redefinida com sucesso!</h3>
              <p className="text-sm text-muted-foreground">
                Sua senha foi atualizada. Agora você pode fazer login com sua nova senha.
              </p>
            </div>
            <Button 
              onClick={handleClose}
              className="w-full bg-[#006837] hover:bg-[#004d29]"
            >
              Fazer Login
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'email' ? 'Recuperação de Senha' : 
             step === 'code' ? 'Verificar Código' : 
             step === 'password' ? 'Redefinir Senha' : 'Sucesso!'}
          </DialogTitle>
          {step === 'email' && (
            <DialogDescription>
              Digite seu e-mail abaixo e enviaremos um código de verificação.
            </DialogDescription>
          )}
        </DialogHeader>
        
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordModal;
