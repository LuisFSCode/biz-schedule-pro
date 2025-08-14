import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Demo from "./pages/Demo";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import PublicLanding from "./pages/PublicLanding";
import ClientLogin from "./pages/ClientLogin";
import ClientSignup from "./pages/ClientSignup";
import ClientBooking from "./pages/ClientBooking";
import ClientAppointments from "./pages/ClientAppointments";
import ClientProfile from "./pages/ClientProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing page para empresários */}
          <Route path="/" element={<Index />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/demo" element={<Demo />} />
          
          {/* Admin dashboard do desenvolvedor */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Rotas administrativas do estabelecimento */}
          <Route path="/:slug/admin/login" element={<AdminLogin />} />
          <Route path="/:slug/admin/dashboard" element={<Dashboard />} />
          
          {/* Rotas do cliente do estabelecimento */}
          <Route path="/:slug/cadastro" element={<ClientSignup />} />
          <Route path="/:slug/entrar" element={<ClientLogin />} />
          <Route path="/:slug/agendar" element={<ClientBooking />} />
          <Route path="/:slug/perfil" element={<ClientProfile />} />
          
          {/* Rotas antigas mantidas para compatibilidade */}
          <Route path="/:slug/login-cliente" element={<ClientLogin />} />
          <Route path="/:slug/cadastro-cliente" element={<ClientSignup />} />
          <Route path="/:slug/:userId/meus-agendamentos" element={<ClientAppointments />} />
          
          {/* Landing page pública do estabelecimento */}
          <Route path="/:slug" element={<PublicLanding />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
