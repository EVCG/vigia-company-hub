
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { authService } from '@/services/authService';
import FormattedInput from '@/components/FormattedInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = authService.login(email, password);
      if (user) {
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
      // Create company and user using separate calls to authService
      // First, ensure we have the required methods in authService
      
      // For simplicity, we'll register the user with company info together
      const success = authService.registerUser({
        fullName,
        email,
        password,
        whatsapp,
        companyName,
        cnpj,
        isAdmin: true,  // First user is admin
        companyId: "", // This will be set by registerUser
      });
      
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
          description: "Ocorreu um erro ao processar sua solicitação.",
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

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate sending reset email
    if (resetEmail) {
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      setShowResetPassword(false);
      setResetEmail('');
    } else {
      toast({
        variant: "destructive",
        title: "Email obrigatório",
        description: "Informe seu email para receber as instruções.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1 text-center p-6">
          <CardTitle className="text-2xl font-bold">Bem-vindo ao VIGIA</CardTitle>
        </CardHeader>
        
        {showResetPassword ? (
          <CardContent className="p-6">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">E-mail</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary">Enviar email de recuperação</Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowResetPassword(false)}
              >
                Voltar ao login
              </Button>
            </form>
          </CardContent>
        ) : (
          <CardContent className="p-6">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-0">
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
                        onClick={() => setShowResetPassword(true)} 
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
              
              <TabsContent value="register" className="mt-0">
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
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Login;
