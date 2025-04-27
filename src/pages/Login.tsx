import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { authService } from '@/services/authService';
import FormattedInput from '@/components/FormattedInput';
import { User } from '@/types/types';
import ResetPasswordModal from '@/components/ResetPasswordModal'; // <-- IMPORTAR O MODAL

const Login: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>("login");

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');

  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false); // <-- CONTROLE DO MODAL

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = authService.login(email, password);
      if (user) {
        if (user.temporaryPassword) {
          setShowChangePassword(true);
          setCurrentUserId(user.id);
          toast({
            title: "Senha temporária detectada",
            description: "Por favor, altere sua senha para continuar.",
          });
          return;
        }

        toast({
          title: "Login realizado com sucesso!",
          description: "Você será redirecionado para o painel.",
        });
        navigate('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao realizar o login.",
          description: "Credenciais inválidas. Verifique seu e-mail e senha.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao realizar o login.",
        description: "Ocorreu um erro ao processar sua solicitação.",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não conferem",
        description: "As senhas informadas não são iguais.",
      });
      return;
    }

    try {
      const existingCompany = authService.getCompanyByCNPJ(cnpj);

      const newUser: Omit<User, 'id' | 'createdAt'> = {
        fullName,
        email,
        password,
        whatsapp,
        companyName,
        cnpj,
        isAdmin: true,
        companyId: existingCompany ? existingCompany.id : "",
        role: "gerente"
      };

      const success = authService.registerUser(newUser);

      if (success) {
        toast({
          title: "Registro realizado com sucesso!",
          description: "Sua conta foi criada. Faça login para continuar.",
        });
        setActiveTab("login");
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao realizar o registro.",
          description: "Ocorreu um erro ao processar sua solicitação. Verifique se o email já está cadastrado.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao realizar o registro.",
        description: "Ocorreu um erro ao processar sua solicitação.",
      });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não conferem",
        description: "A nova senha e a confirmação devem ser idênticas.",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    try {
      const result = authService.updatePassword(currentUserId, newPassword);

      if (result.success) {
        toast({
          title: "Senha alterada com sucesso!",
          description: "Agora você pode acessar o sistema com sua nova senha.",
        });
        setShowChangePassword(false);
        navigate('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao alterar senha",
          description: result.message || "Não foi possível alterar sua senha.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao alterar senha",
        description: "Ocorreu um erro ao processar sua solicitação.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1 text-center p-6">
          <CardTitle className="text-2xl font-bold">Bem-vindo ao VIGIA</CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {showChangePassword ? (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">Você está usando uma senha temporária. Por favor, crie uma nova senha para continuar.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirmar Nova Senha</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary">Alterar Senha</Button>
            </form>
          ) : (
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-blue-50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Senha</Label>
                      <Button
                        variant="link"
                        type="button"
                        onClick={() => setIsResetPasswordModalOpen(true)} // <-- ABRIR MODAL
                        className="p-0 h-auto text-primary font-normal text-sm"
                      >
                        Esqueceu sua senha?
                      </Button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-blue-50"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary">Entrar</Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input
                      id="fullName"
                      placeholder="Seu nome completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register">E-mail</Label>
                    <Input
                      id="email-register"
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <FormattedInput
                      id="whatsapp"
                      mask="phone"
                      value={whatsapp}
                      onChange={(value) => setWhatsapp(value)}
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input
                      id="companyName"
                      placeholder="Nome da sua empresa"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <FormattedInput
                      id="cnpj"
                      mask="cnpj"
                      value={cnpj}
                      onChange={(value) => setCnpj(value)}
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Senha</Label>
                    <Input
                      id="password-register"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Senha</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary">Cadastrar</Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Modal Reset Password */}
      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Login;
