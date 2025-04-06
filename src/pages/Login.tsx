
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import FormattedInput from '@/components/FormattedInput';
import { authService } from '@/services/authService';
import Logo from '@/components/Logo';
import ResetPasswordModal from '@/components/ResetPasswordModal';
import ChangePasswordModal from '@/components/ChangePasswordModal';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    companyName: '',
    cnpj: '',
    password: '',
    confirmPassword: '',
  });
  
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  
  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      // Validação básica
      if (!loginData.email || !loginData.password) {
        toast({
          title: "Erro",
          description: "Por favor, preencha todos os campos",
          variant: "destructive"
        });
        return;
      }
      
      const result = authService.login(loginData.email, loginData.password);
      
      if (result.success) {
        toast({
          title: "Login realizado",
          description: "Você foi autenticado com sucesso"
        });
        
        // Verificar se o usuário precisa trocar a senha
        if (result.requirePasswordChange && result.user) {
          setCurrentUserId(result.user.id);
          setShowPasswordChangeModal(true);
        } else {
          // Redirecionamento após login bem-sucedido
          navigate('/dashboard');
        }
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar fazer login",
        variant: "destructive"
      });
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    
    try {
      // Validação básica
      if (
        !registerData.fullName ||
        !registerData.email ||
        !registerData.whatsapp ||
        !registerData.companyName ||
        !registerData.cnpj ||
        !registerData.password
      ) {
        toast({
          title: "Erro",
          description: "Por favor, preencha todos os campos",
          variant: "destructive"
        });
        setIsRegistering(false);
        return;
      }
      
      if (registerData.password !== registerData.confirmPassword) {
        toast({
          title: "Erro",
          description: "As senhas não coincidem",
          variant: "destructive"
        });
        setIsRegistering(false);
        return;
      }
      
      // Registro
      const result = authService.registerCompany(
        registerData.companyName,
        registerData.cnpj,
        registerData.fullName,
        registerData.email,
        registerData.whatsapp,
        registerData.password
      );
      
      if (result.success) {
        toast({
          title: "Cadastro realizado",
          description: "Empresa e usuário criados com sucesso"
        });
        
        // Fazer login automático após o registro
        const loginResult = authService.login(registerData.email, registerData.password);
        
        if (loginResult.success) {
          navigate('/dashboard');
        } else {
          toast({
            title: "Atenção",
            description: "Cadastro realizado, mas não foi possível fazer login automático. Por favor, faça login manualmente."
          });
        }
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar realizar o cadastro",
        variant: "destructive"
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handlePasswordChangeSuccess = () => {
    setShowPasswordChangeModal(false);
    navigate('/dashboard');
  };
  
  // Verificar se o usuário já está autenticado
  React.useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Modal para troca obrigatória de senha */}
      {showPasswordChangeModal && (
        <ChangePasswordModal
          userId={currentUserId}
          isOpen={showPasswordChangeModal}
          onSuccess={handlePasswordChangeSuccess}
        />
      )}
      
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl text-center">Bem-vindo ao VIGIA</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">E-mail</label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      placeholder="seu.email@exemplo.com" 
                      value={loginData.email}
                      onChange={handleLoginInputChange}
                      autoComplete="email"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="password" className="text-sm font-medium">Senha</label>
                      <ResetPasswordModal />
                    </div>
                    <Input 
                      id="password" 
                      name="password"
                      type="password" 
                      placeholder="********" 
                      value={loginData.password}
                      onChange={handleLoginInputChange}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#006837] hover:bg-[#004d29]" 
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium">Nome Completo</label>
                    <Input 
                      id="fullName" 
                      name="fullName"
                      placeholder="Seu nome completo" 
                      value={registerData.fullName}
                      onChange={handleRegisterInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">E-mail</label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      placeholder="seu.email@exemplo.com" 
                      value={registerData.email}
                      onChange={handleRegisterInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp</label>
                    <FormattedInput 
                      id="whatsapp" 
                      name="whatsapp"
                      placeholder="(00) 00000-0000" 
                      value={registerData.whatsapp}
                      onChange={handleRegisterInputChange}
                      format="(##) #####-####"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="companyName" className="text-sm font-medium">Nome da Empresa</label>
                    <Input 
                      id="companyName" 
                      name="companyName"
                      placeholder="Nome da sua empresa" 
                      value={registerData.companyName}
                      onChange={handleRegisterInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="cnpj" className="text-sm font-medium">CNPJ</label>
                    <FormattedInput 
                      id="cnpj" 
                      name="cnpj"
                      placeholder="00.000.000/0000-00" 
                      value={registerData.cnpj}
                      onChange={handleRegisterInputChange}
                      format="##.###.###/####-##"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="registerPassword" className="text-sm font-medium">Senha</label>
                    <Input 
                      id="registerPassword" 
                      name="password"
                      type="password" 
                      placeholder="********" 
                      value={registerData.password}
                      onChange={handleRegisterInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Senha</label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword"
                      type="password" 
                      placeholder="********" 
                      value={registerData.confirmPassword}
                      onChange={handleRegisterInputChange}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#006837] hover:bg-[#004d29]" 
                    disabled={isRegistering}
                  >
                    {isRegistering ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
