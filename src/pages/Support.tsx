
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { monitoringService } from '@/services/monitoringService';
import { authService } from '@/services/authService';
import { AlertMessage } from '@/types/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useNavigate } from 'react-router-dom';

const Support: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [problemDescription, setProblemDescription] = useState('');
  const [isSupportModalOpen, setSupportModalOpen] = useState(false);
  const [ticketSent, setTicketSent] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<AlertMessage | null>(monitoringService.getAlerts()[0]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  const currentUser = authService.getCurrentUser();
  
  // Carousel images
  const carouselImages = [
    { title: "Monitoramento em Tempo Real", description: "Acompanhe seus pregões em tempo real", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGRhc2hib2FyZHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { title: "Análise de Dados", description: "Visualize estatísticas e informações detalhadas", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGNoYXJ0c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { title: "Suporte Especializado", description: "Nossa equipe está sempre pronta para ajudar", imageUrl: "https://images.unsplash.com/photo-1560264280-88b68371db39?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y3VzdG9tZXIlMjBzZXJ2aWNlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { title: "Alertas Instantâneos", description: "Receba notificações importantes sobre suas licitações", imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fG5vdGlmaWNhdGlvbnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { title: "Gestão de Funcionários", description: "Organize sua equipe de forma eficiente", imageUrl: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dGVhbXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { title: "Análises Avançadas", description: "Explore visualizações detalhadas de dados", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGNoYXJ0c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
  ];
  
  const handleSubmit = () => {
    if (!problemDescription.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, descreva o problema antes de enviar.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentUser) {
      const newTicket = monitoringService.addSupportTicket(currentUser.id, problemDescription);
      if (newTicket) {
        setTicketSent(true);
        toast({
          title: "Sucesso",
          description: "Ticket de suporte enviado com sucesso!",
        });
      }
    } else {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para enviar um ticket de suporte.",
        variant: "destructive",
      });
    }
  };
  
  const openSupportModal = () => {
    setProblemDescription('');
    setTicketSent(false);
    setSupportModalOpen(true);
  };
  
  // Funções de navegação para os cards
  const handleMonitorarClick = () => {
    navigate('/dashboard');
  };
  
  const handleNewsClick = () => {
    window.open('https://www.gov.br/compras/pt-br/acesso-a-informacao/noticias', '_blank');
  };
  
  const handleAnaliseClick = () => {
    navigate('/report');
  };
  
  // Função para renderizar os cards que não são de suporte
  const renderFeatureCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Monitorar</h3>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <Button className="mt-4" onClick={handleMonitorarClick}>
              Acessar Dashboard
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary text-2xl">📰</span>
            </div>
            <h3 className="text-lg font-medium mb-2">News</h3>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <Button className="mt-4" onClick={handleNewsClick}>
              Acessar Notícias
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary text-2xl">📈</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Análise Estatística</h3>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <Button className="mt-4" onClick={handleAnaliseClick}>
              Acessar Relatórios
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow md:col-start-2">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary text-2xl">🛟</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Suporte</h3>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <Button className="mt-4" onClick={openSupportModal}>
              Solicitar Suporte
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Carousel */}
      <div className="mb-8">
        <Carousel className="w-full">
          <CarouselContent>
            {carouselImages.map((item, index) => (
              <CarouselItem key={index}>
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-none overflow-hidden">
                  <CardContent className="p-4 md:p-8 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 p-4">
                      <h2 className="text-secondary text-xl md:text-3xl font-bold mb-2 md:mb-4">{item.title}</h2>
                      <p className="text-secondary text-sm md:text-lg">{item.description}</p>
                    </div>
                    <div className="md:w-1/2 mt-4 md:mt-0">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-48 md:h-64 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
      
      {/* Cards de recursos */}
      {renderFeatureCards()}
      
      {/* Modal de Suporte */}
      <Dialog open={isSupportModalOpen} onOpenChange={setSupportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Suporte</span>
            </DialogTitle>
            <DialogDescription>
              Por favor, preencha o campo abaixo de forma completa e precisa para que possamos solucionar seu problema de maneira eficaz. Nossa equipe entrará em contato com você assim que possível.
              <p className="mt-2 text-xs text-gray-500">
                Observação: Caso não tenha fornecido todas as informações necessárias, solicitamos que preencha o campo novamente.
              </p>
            </DialogDescription>
          </DialogHeader>
          
          {ticketSent ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-green-600 mb-2">Informações Enviadas</h3>
              <div className="w-full bg-green-100 h-1 my-4"></div>
              <p className="text-sm text-gray-600 text-center">
                Seu ticket foi registrado com sucesso. Nossa equipe analisará sua solicitação e entrará em contato em breve.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="problem-description" className="font-medium">
                  Descrição do Problema <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="problem-description"
                  placeholder="Descreva seu problema detalhadamente..."
                  className="h-32"
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                  Enviar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Support;
