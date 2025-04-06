import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { authService } from '@/services/authService';
import { FormattedInput } from '@/components/FormattedInput';

const Login: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = authService.login(email, password);
      if (success) {
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
    try {
      const success = authService.registerCompanyAndUser({
        companyName,
        cnpj,
        fullName,
        email,
        whatsapp,
        password,
      });
      if (success) {
        toast({
          title: "Registro realizado com sucesso!",
          description: "Sua conta foi criada. Faça login para continuar.",
        });
        setIsRegistering(false);
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">{isRegistering ? "Criar uma conta" : "Login"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {isRegistering ? (
            <Form onSubmit={handleRegister}>
              <div className="grid gap-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    placeholder="Seu nome"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <FormattedInput
                    label="WhatsApp"
                    value={whatsapp}
                    onChange={value => setWhatsapp(value)}
                    mask="(99) 99999-9999"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    placeholder="Nome da sua empresa"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                   <FormattedInput
                      label="CNPJ"
                      value={cnpj}
                      onChange={value => setCnpj(value)}
                      mask="99.999.999/9999-99"
                      placeholder="00.000.000/0000-00"
                      required
                    />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit">Criar conta</Button>
              </div>
            </Form>
          ) : (
            <Form onSubmit={handleLogin}>
              <div className="grid gap-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit">Entrar</Button>
              </div>
            </Form>
          )}
          <div className="px-4 text-center text-sm text-muted-foreground">
            {isRegistering ? (
              <>
                Já tem uma conta?{" "}
                <Button variant="link" onClick={() => setIsRegistering(false)}>
                  Entrar
                </Button>
              </>
            ) : (
              <>
                Não tem uma conta?{" "}
                <Button variant="link" onClick={() => setIsRegistering(true)}>
                  Criar uma conta
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
