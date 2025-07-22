
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, startTransition } from "react";

// Core providers (loaded immediately)
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { queryClient } from "@/config/queryClient";
import { OptimizedLoading } from "@/components/ui/optimized-loading";
import { setupGlobalErrorHandling } from "@/utils/production-logger";

// Lazy load providers
const AdminAuthProvider = lazy(() => import("@/hooks/useAdminAuth").then(m => ({ default: m.AdminAuthProvider })));
const ErrorBoundary = lazy(() => import("@/components/ErrorBoundary").then(m => ({ default: m.ErrorBoundary })));
const Layout = lazy(() => import("@/components/layout/Layout").then(m => ({ default: m.Layout })));

// Lazy Loading de Páginas

// Páginas críticas (carregamento imediato)
const Index = lazy(() => import("@/pages/Index"));
const Auth = lazy(() => import("@/pages/Auth"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Páginas com lazy loading
const SuperAdmin = lazy(() => import("@/pages/SuperAdmin"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Atendimento = lazy(() => import("@/pages/Atendimento"));
const ChatInterno = lazy(() => import("@/pages/ChatInterno"));
const Contatos = lazy(() => import("@/pages/Contatos"));
const Kanban = lazy(() => import("@/pages/Kanban"));
const ChatBot = lazy(() => import("@/pages/ChatBot"));
const Automations = lazy(() => import("@/pages/Automations"));
const Usuarios = lazy(() => import("@/pages/Usuarios"));
const Setores = lazy(() => import("@/pages/Setores"));
const GerenciarEquipe = lazy(() => import("@/pages/GerenciarEquipe"));
const MeuPerfil = lazy(() => import("@/pages/MeuPerfil"));
const PlanoFaturamento = lazy(() => import("@/pages/PlanoFaturamento"));
const FlowBuilder = lazy(() => import("@/pages/FlowBuilder"));
const Painel = lazy(() => import("@/pages/Painel"));
const MelhoriasDashboard = lazy(() => import("@/pages/MelhoriasDashboard"));
const ConfiguracoesGerais = lazy(() => import("@/pages/configuracoes/ConfiguracoesGerais"));
const ConfiguracoesAvancadas = lazy(() => import("@/pages/configuracoes/ConfiguracoesAvancadas"));
const PreferenciasNotificacao = lazy(() => import("@/pages/configuracoes/PreferenciasNotificacao"));
const Aparencia = lazy(() => import("@/pages/configuracoes/Aparencia"));
const Idioma = lazy(() => import("@/pages/configuracoes/Idioma"));

// Componente de fallback ultra-rápido
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="loading-spinner" />
  </div>
);

// Fallback mínimo para inicial
const MinimalFallback = () => (
  <div className="h-screen w-full bg-background" />
);

// Otimização de bundle splitting
const preloadCriticalRoutes = () => {
  // Precarregar rotas mais acessadas após inicialização
  setTimeout(() => {
    if (window.location.pathname !== '/dashboard') {
      import('@/pages/Dashboard').catch(() => {});
    }
    if (window.location.pathname !== '/atendimento') {
      import('@/pages/Atendimento').catch(() => {});
    }
    if (window.location.pathname !== '/contatos') {
      import('@/pages/Contatos').catch(() => {});
    }
  }, 100);
};

function AppRoutes() {
  useEffect(() => {
    startTransition(() => {
      preloadCriticalRoutes();
    });
  }, []);

  return (
    <Routes>
      {/* Redirecionamento direto para painel */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout title="Painel" description="Visão geral do sistema">
            <Suspense fallback={<PageFallback />}>
              <Painel />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Rota de autenticação - carregamento rápido */}
      <Route path="/auth" element={
        <Suspense fallback={<PageFallback />}>
          <Auth />
        </Suspense>
      } />
      
      {/* Super Admin com carregamento otimizado */}
      <Route path="/admin" element={
        <Suspense fallback={<PageFallback />}>
          <ProtectedRoute>
            <SuperAdmin />
          </ProtectedRoute>
        </Suspense>
      } />
      
      {/* Rotas principais com layout rápido */}
      <Route path="/painel" element={
        <Suspense fallback={<PageFallback />}>
          <ProtectedRoute>
            <Layout title="Painel" description="Visão geral do sistema">
              <Painel />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      } />
      
      <Route path="/dashboard" element={
        <Suspense fallback={<PageFallback />}>
          <ProtectedRoute>
            <Layout title="Dashboard" description="Métricas e estatísticas">
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      } />
      
      <Route path="/atendimento" element={
        <Suspense fallback={<PageFallback />}>
          <ProtectedRoute>
            <Layout title="Atendimento" description="Central de atendimento">
              <Atendimento />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      } />
      
      <Route path="/contatos" element={
        <Suspense fallback={<PageFallback />}>
          <ProtectedRoute>
            <Layout title="Contatos" description="Gerenciamento de contatos">
              <Contatos />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      } />
      
      <Route path="/kanban" element={
        <ProtectedRoute>
          <Layout title="Kanban" description="Quadro de tarefas">
            <Suspense fallback={<PageFallback />}>
              <Kanban />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/chatbot" element={
        <ProtectedRoute>
          <Layout title="ChatBot" description="Automação inteligente">
            <Suspense fallback={<PageFallback />}>
              <ChatBot />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/chatbot/flow-builder/:id" element={
        <ProtectedRoute>
          <Suspense fallback={<PageFallback />}>
            <FlowBuilder />
          </Suspense>
        </ProtectedRoute>
      } />
      
      <Route path="/automations" element={
        <ProtectedRoute>
          <Layout title="Automações" description="Fluxos de automação">
            <Suspense fallback={<PageFallback />}>
              <Automations />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      
      <Route path="/usuarios" element={
        <ProtectedRoute>
          <Layout title="Usuários" description="Gerenciamento de usuários">
            <Suspense fallback={<PageFallback />}>
              <Usuarios />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/setores" element={
        <ProtectedRoute>
          <Layout title="Setores" description="Organização por setores">
            <Suspense fallback={<PageFallback />}>
              <Setores />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/gerenciar-equipe" element={
        <ProtectedRoute>
          <Layout title="Gerenciar Equipe" description="Administração da equipe">
            <Suspense fallback={<PageFallback />}>
              <GerenciarEquipe />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/meu-perfil" element={
        <ProtectedRoute>
          <Layout title="Meu Perfil" description="Configurações pessoais">
            <Suspense fallback={<PageFallback />}>
              <MeuPerfil />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/plano-faturamento" element={
        <ProtectedRoute>
          <Layout title="Plano e Faturamento" description="Gerenciamento financeiro">
            <Suspense fallback={<PageFallback />}>
              <PlanoFaturamento />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />

      {/* Rotas de configuração */}
      <Route path="/configuracoes/gerais" element={
        <ProtectedRoute>
          <Layout title="Configurações Gerais" description="Configurações do sistema">
            <Suspense fallback={<PageFallback />}>
              <ConfiguracoesGerais />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/configuracoes/avancadas" element={
        <ProtectedRoute>
          <Layout title="Configurações Avançadas" description="Configurações técnicas">
            <Suspense fallback={<PageFallback />}>
              <ConfiguracoesAvancadas />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/configuracoes/notificacoes" element={
        <ProtectedRoute>
          <Layout title="Notificações" description="Preferências de notificação">
            <Suspense fallback={<PageFallback />}>
              <PreferenciasNotificacao />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/configuracoes/aparencia" element={
        <ProtectedRoute>
          <Layout title="Aparência" description="Personalização visual">
            <Suspense fallback={<PageFallback />}>
              <Aparencia />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/configuracoes/idioma" element={
        <ProtectedRoute>
          <Layout title="Idioma" description="Configurações de idioma">
            <Suspense fallback={<PageFallback />}>
              <Idioma />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={
        <Suspense fallback={<PageFallback />}>
          <NotFound />
        </Suspense>
      } />
    </Routes>
  );
}

const App = () => {
  // Setup global error handling
  useEffect(() => {
    setupGlobalErrorHandling();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<MinimalFallback />}>
            <AdminAuthProvider>
              <TooltipProvider>
                <Toaster />
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </TooltipProvider>
            </AdminAuthProvider>
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
