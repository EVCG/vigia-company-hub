
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Logo from '@/components/Logo';
import { Eye, EyeOff, LockKeyhole, Mail, User, Building, Phone } from 'lucide-react';
import { authService } from '@/services/authService';
import FormattedInput from '@/components/FormattedInput';

const Login: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Estado para login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Estado para registro de empresa
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Função de login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    
    const result = authService.login(loginEmail, loginPassword);
    
    if (result.success) {
      toast({
        title: "Sucesso",
        description: "Login realizado com sucesso",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Erro",
        description: result.message,
        variant: "destructive",
      });
    }
  };
  
  // Função de registro
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos
    if (!companyName || !cnpj || !fullName || !email || !whatsapp || !password || !confirmPassword) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    
    // Validar senhas
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }
    
    // Registrar empresa
    const result = authService.registerCompany(
      companyName,
      cnpj,
      fullName,
      email,
      whatsapp,
      password
    );
    
    if (result.success) {
      toast({
        title: "Sucesso",
        description: "Empresa registrada com sucesso",
      });
      
      // Fazer login automaticamente
      const loginResult = authService.login(email, password);
      
      if (loginResult.success) {
        navigate('/dashboard');
      }
    } else {
      toast({
        title: "Erro",
        description: result.message,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Imagem de fundo */}
      <div className="hidden md:flex md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/public/lovable-uploads/f9d53286-c6c8-49c4-b9da-bdfc00e6f312.png')" }}>
        <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-20">
          <div className="p-8">
            {/* Você pode adicionar algum conteúdo aqui se desejar */}
          </div>
        </div>
      </div>
      
      {/* Lado direito - Formulários */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>
            
            {/* Tab de Login */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Usuário</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="Digite seu usuário..." 
                      className="pl-10" 
                      value={loginEmail} 
                      onChange={(e) => setLoginEmail(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Senha</Label>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Esqueceu sua senha?
                    </a>
                  </div>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                      id="login-password" 
                      type={showLoginPassword ? "text" : "password"} 
                      placeholder="Digite sua senha..." 
                      className="pl-10" 
                      value={loginPassword} 
                      onChange={(e) => setLoginPassword(e.target.value)} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowLoginPassword(!showLoginPassword)} 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showLoginPassword ? (
                        <EyeOff className="text-gray-400" size={18} />
                      ) : (
                        <Eye className="text-gray-400" size={18} />
                      )}
                    </button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Entrar
                </Button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Ou continue com</span>
                  </div>
                </div>
                
                <Button type="button" variant="outline" className="w-full">
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                  Fazer login como Elisson
                </Button>
                
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-500">
                    Ainda não tem uma conta? <span className="text-primary hover:underline cursor-pointer">Faça um teste grátis!</span>
                  </p>
                </div>
              </form>
            </TabsContent>
            
            {/* Tab de Cadastro */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                      id="company-name" 
                      placeholder="Digite o nome da empresa" 
                      className="pl-10" 
                      value={companyName} 
                      onChange={(e) => setCompanyName(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <FormattedInput 
                      id="cnpj" 
                      mask="cnpj" 
                      placeholder="00.000.000/0000-00" 
                      className="pl-10" 
                      value={cnpj} 
                      onChange={setCnpj} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="full-name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                      id="full-name" 
                      placeholder="Digite seu nome completo" 
                      className="pl-10" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Digite seu e-mail" 
                      className="pl-10" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <FormattedInput 
                      id="whatsapp" 
                      mask="phone" 
                      placeholder="(00) 00000-0000" 
                      className="pl-10" 
                      value={whatsapp} 
                      onChange={setWhatsapp} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Crie uma senha" 
                      className="pl-10" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="text-gray-400" size={18} />
                      ) : (
                        <Eye className="text-gray-400" size={18} />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                      id="confirm-password" 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Confirme sua senha" 
                      className="pl-10" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="text-gray-400" size={18} />
                      ) : (
                        <Eye className="text-gray-400" size={18} />
                      )}
                    </button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Cadastrar
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
