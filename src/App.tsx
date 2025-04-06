
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Monitor from "./pages/Monitor";
import Report from "./pages/Report";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { monitoringService } from "./services/monitoringService";

const queryClient = new QueryClient();

const App = () => {
  // Inicializar dados de exemplo quando o aplicativo carrega
  useEffect(() => {
    monitoringService.initializeExampleData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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
            </Route>
            
            {/* Rota para página não encontrada */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
