
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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

// Component to handle route transitions with loading screen
const RouteTransition = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    setIsLoading(true);
    // Reset loading state after a short delay to ensure the loading screen shows
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location]);
  
  return <LoadingScreen isLoading={isLoading}>{children}</LoadingScreen>;
};

const queryClient = new QueryClient();

const App = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Inicializar dados de exemplo quando o aplicativo carrega
  useEffect(() => {
    const initializeData = async () => {
      try {
        monitoringService.initializeExampleData();
        // Simulando carregamento de dados
        setTimeout(() => {
          setInitialLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Erro ao inicializar dados:", error);
        setInitialLoading(false);
      }
    };
    
    initializeData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LoadingScreen isLoading={initialLoading}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rota de autenticação */}
              <Route path="/login" element={
                <RouteTransition>
                  <Login />
                </RouteTransition>
              } />
              
              {/* Rota padrão - redireciona para login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Rotas protegidas - dentro do MainLayout */}
              <Route element={
                <RouteTransition>
                  <MainLayout />
                </RouteTransition>
              }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/monitor" element={<Monitor />} />
                <Route path="/report" element={<Report />} />
                <Route path="/support" element={<Support />} />
                <Route path="/employee-management" element={<EmployeeManagement />} />
              </Route>
              
              {/* Rota para página não encontrada */}
              <Route path="*" element={
                <RouteTransition>
                  <NotFound />
                </RouteTransition>
              } />
            </Routes>
          </BrowserRouter>
        </LoadingScreen>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
