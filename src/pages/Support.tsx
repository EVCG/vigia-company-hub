
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { monitoringService } from '@/services/monitoringService';
import { authService } from '@/services/authService';
import { AlertMessage } from '@/types/types';

const Support: React.FC = () => {
  const { toast } = useToast();
  const [problemDescription, setProblemDescription] = useState('');
  const [isSupportModalOpen, setSupportModalOpen] = useState(false);
  const [ticketSent, setTicketSent] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<AlertMessage | null>(monitoringService.getAlerts()[0]);
  
  const currentUser = authService.getCurrentUser();
  
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
      {/* Alerta principal */}
      {currentAlert && (
        <div className="relative">
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-4">
            <button className="text-gray-400 hover:text-gray-700 focus:outline-none">
              &lt;
            </button>
          </div>
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-4">
            <button className="text-gray-400 hover:text-gray-700 focus:outline-none">
              &gt;
            </button>
          </div>
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-none overflow-hidden">
            <CardContent className="p-8 text-center">
              <h2 className="text-secondary text-3xl font-bold mb-4">
                {currentAlert.title}
              </h2>
              <h3 className="text-secondary text-5xl font-bold">
                {currentAlert.content}
              </h3>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Cards de recursos */}
      {renderFeatureCards()}
      
      {/* Modal de Suporte */}
      <Dialog open={isSupportModalOpen} onOpenChange={setSupportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Suporte</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => setSupportModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
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
