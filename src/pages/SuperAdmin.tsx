import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ErrorBoundaryAdmin } from '@/components/admin/ErrorBoundaryAdmin';

// Componentes consolidados por área
import EmpresasTab from '@/components/admin/EmpresasTab';
import UsuariosTab from '@/components/admin/UsuariosTab';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import PlanosGerenciamento from '@/components/admin/PlanosGerenciamento';
import IntegracoesCentralizadas from '@/components/admin/IntegracoesCentralizadas';
import ConfiguracoesAvancadas from '@/components/admin/ConfiguracoesAvancadas';
import QueueMonitoring from '@/components/admin/QueueMonitoring';

export default function SuperAdmin() {
  const { user, loading: authLoading } = useAuth();
  const { isSuperAdmin, loading: roleLoading } = useUserRole();
  const { isAdminAuthenticated, loading: adminAuthLoading } = useAdminAuth();

  if (authLoading || roleLoading || adminAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!user || !isSuperAdmin) {
    return <Navigate to="/painel" replace />;
  }

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout title="Super Admin" description="Gerencie todas as empresas e configurações da plataforma">
      <ErrorBoundaryAdmin>
        <Tabs defaultValue="analytics" className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-max grid-cols-7 min-w-full lg:min-w-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <TabsTrigger value="analytics">Dashboard</TabsTrigger>
              <TabsTrigger value="empresas">Empresas</TabsTrigger>
              <TabsTrigger value="usuarios">Usuários</TabsTrigger>
              <TabsTrigger value="planos">Planos</TabsTrigger>
              <TabsTrigger value="integracoes">Integrações</TabsTrigger>
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
              <TabsTrigger value="filas">Monitoramento</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Dashboard Analytics</CardTitle>
                <CardDescription>
                  Métricas gerais, relatórios e visão consolidada da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="empresas">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Gestão de Empresas</CardTitle>
                <CardDescription>
                  Gerencie todas as empresas cadastradas na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmpresasTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usuarios">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Gestão de Usuários</CardTitle>
                <CardDescription>
                  Visualize e gerencie usuários de todas as empresas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UsuariosTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planos">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Gestão de Planos</CardTitle>
                <CardDescription>
                  Configure planos, permissões e funcionalidades da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PlanosGerenciamento />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integracoes">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Central de Integrações</CardTitle>
                <CardDescription>
                  WhatsApp, Evolution API, n8n, webhooks e todas as configurações de integração
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IntegracoesCentralizadas />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracoes">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  API Keys, configurações avançadas e permissões do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConfiguracoesAvancadas />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="filas">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Monitoramento do Sistema</CardTitle>
                <CardDescription>
                  Filas de mensagens, logs e performance da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QueueMonitoring />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ErrorBoundaryAdmin>
    </AdminLayout>
  );
}