
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MainLayout from "./components/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Monitor from "./pages/Monitor";
import Report from "./pages/Report";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";
import EmployeeManagement from "./pages/EmployeeManagement";
import { monitoringService } from "./services/monitoringService";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Inicializar dados de exemplo quando o aplicativo carrega
  useEffect(() => {
    const initializeData = async () => {
      try {
        monitoringService.initializeExampleData();
        // Simulando carregamento de dados
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Erro ao inicializar dados:", error);
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LoadingScreen isLoading={isLoading}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rota de autenticação */}
              <Route path="/login" element={<Login />} />
              
              {/* Rota padrão - redireciona para login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Rotas protegidas - dentro do MainLayout */}
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/monitor" element={<Monitor />} />
                <Route path="/report" element={<Report />} />
                <Route path="/support" element={<Support />} />
                <Route path="/employee-management" element={<EmployeeManagement />} />
              </Route>
              
              {/* Rota para página não encontrada */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LoadingScreen>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
