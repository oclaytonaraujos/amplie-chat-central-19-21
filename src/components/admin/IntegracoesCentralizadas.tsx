import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Activity, 
  TestTube, 
  BarChart3,
  MessageSquare,
  Workflow,
  Webhook,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EvolutionApiConfigTab from './EvolutionApiConfigTab';
import EvolutionApiArchitecture from './EvolutionApiArchitecture';
import IntegrationCard from './integrations/IntegrationCard';
import MetricsOverview from './integrations/MetricsOverview';
import ActivityLogs from './integrations/ActivityLogs';
import IntegrationTester from './integrations/IntegrationTester';

interface Integration {
  id: string;
  name: string;
  description: string;
  type: 'evolution' | 'n8n' | 'whatsapp' | 'webhook' | 'chatbot';
  status: 'connected' | 'disconnected' | 'error' | 'configuring';
  baseUrl: string;
  lastActivity?: string;
  metrics?: {
    requests?: number;
    successRate?: number;
    uptime?: string;
  };
}

interface LogEntry {
  id: string;
  timestamp: string;
  integration: string;
  type: 'request' | 'response' | 'error' | 'config';
  status: 'success' | 'error' | 'pending';
  method?: string;
  endpoint?: string;
  statusCode?: number;
  responseTime?: number;
  message: string;
  details?: any;
}

export default function IntegracoesCentralizadas() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const { toast } = useToast();

  // Dados de métricas mockados para demonstração
  const metricsData = {
    totalIntegrations: 5,
    activeIntegrations: 4,
    totalRequests: 12457,
    successRate: 97.8,
    averageResponseTime: 145,
    uptime: "99.9%"
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Simular dados das integrações
      const integrationsData: Integration[] = [
        {
          id: '1',
          name: 'Evolution API Global',
          description: 'Configuração global da Evolution API para WhatsApp',
          type: 'evolution',
          status: 'connected',
          baseUrl: 'https://api.evolution-api.com',
          lastActivity: 'há 5 minutos',
          metrics: {
            requests: 3542,
            successRate: 98.5,
            uptime: '99.9%'
          }
        },
        {
          id: '2',
          name: 'N8N Automation Hub',
          description: 'Central de automações e workflows avançados',
          type: 'n8n',
          status: 'connected',
          baseUrl: 'https://n8n.amplie-chat.com',
          lastActivity: 'há 2 minutos',
          metrics: {
            requests: 1847,
            successRate: 96.2,
            uptime: '99.5%'
          }
        },
        {
          id: '3',
          name: 'WhatsApp Business',
          description: 'Integração oficial do WhatsApp Business API',
          type: 'whatsapp',
          status: 'error',
          baseUrl: 'https://graph.facebook.com',
          lastActivity: 'há 2 horas',
          metrics: {
            requests: 856,
            successRate: 85.4,
            uptime: '95.2%'
          }
        },
        {
          id: '4',
          name: 'Webhook Personalizado',
          description: 'Webhook customizado para integrações externas',
          type: 'webhook',
          status: 'disconnected',
          baseUrl: 'https://webhook.amplie-chat.com',
          lastActivity: 'há 1 dia',
          metrics: {
            requests: 234,
            successRate: 100,
            uptime: '100%'
          }
        },
        {
          id: '5',
          name: 'Chatbot Engine',
          description: 'Motor de processamento de chatbots inteligentes',
          type: 'chatbot',
          status: 'connected',
          baseUrl: 'https://chatbot.amplie-chat.com',
          lastActivity: 'há 1 minuto',
          metrics: {
            requests: 5978,
            successRate: 99.1,
            uptime: '99.8%'
          }
        }
      ];

      // Simular logs de atividade
      const logsData: LogEntry[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          integration: 'Evolution API Global',
          type: 'request',
          status: 'success',
          method: 'POST',
          endpoint: '/message/send',
          statusCode: 200,
          responseTime: 145,
          message: 'Mensagem enviada com sucesso'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
          integration: 'N8N Automation Hub',
          type: 'response',
          status: 'success',
          method: 'POST',
          endpoint: '/webhook/trigger',
          statusCode: 200,
          responseTime: 89,
          message: 'Workflow executado com sucesso'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          integration: 'WhatsApp Business',
          type: 'error',
          status: 'error',
          method: 'GET',
          endpoint: '/messages',
          statusCode: 500,
          responseTime: 5000,
          message: 'Timeout na requisição - API indisponível'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          integration: 'Chatbot Engine',
          type: 'config',
          status: 'success',
          message: 'Configuração de fluxo atualizada'
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          integration: 'Evolution API Global',
          type: 'request',
          status: 'success',
          method: 'POST',
          endpoint: '/instance/create',
          statusCode: 201,
          responseTime: 234,
          message: 'Nova instância criada'
        }
      ];

      setIntegrations(integrationsData);
      setLogs(logsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados das integrações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            status: integration.status === 'connected' ? 'disconnected' : 'connected' 
          }
        : integration
    ));

    const integration = integrations.find(i => i.id === id);
    toast({
      title: "Status Atualizado",
      description: `${integration?.name} foi ${integration?.status === 'connected' ? 'desconectado' : 'conectado'}`,
    });
  };

  const handleConfigureIntegration = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    toast({
      title: "Configuração",
      description: `Abrindo configurações para ${integration?.name}`,
    });
  };

  const getIntegrationIcon = (type: string) => {
    const icons = {
      evolution: <MessageSquare className="w-5 h-5" />,
      n8n: <Workflow className="w-5 h-5" />,
      whatsapp: <MessageSquare className="w-5 h-5" />,
      webhook: <Webhook className="w-5 h-5" />,
      chatbot: <Zap className="w-5 h-5" />
    };
    return icons[type as keyof typeof icons] || <Settings className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Central de Integrações</h2>
          <p className="text-muted-foreground">
            Gerencie e monitore todas as integrações do sistema
          </p>
        </div>
        <Button onClick={loadData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <Tabs defaultValue="architecture" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="architecture" className="flex items-center gap-2">
            <Workflow className="w-4 h-4" />
            Arquitetura
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="evolution-api" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Evolution API
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="tester" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Testador
          </TabsTrigger>
        </TabsList>

        <TabsContent value="architecture" className="space-y-6">
          <EvolutionApiArchitecture />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <MetricsOverview data={metricsData} />
          
          <Card>
            <CardHeader>
              <CardTitle>Status das Integrações</CardTitle>
              <CardDescription>
                Resumo do status atual de todas as integrações ativas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{integration.name}</span>
                      <div className={`w-3 h-3 rounded-full ${
                        integration.status === 'connected' ? 'bg-green-500' :
                        integration.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{integration.description}</p>
                    {integration.metrics && (
                      <div className="text-xs text-muted-foreground">
                        {integration.metrics.requests} requisições • {integration.metrics.successRate}% sucesso
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution-api">
          <EvolutionApiConfigTab />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                name={integration.name}
                description={integration.description}
                type={integration.type}
                status={integration.status}
                lastActivity={integration.lastActivity}
                metrics={integration.metrics}
                onConfigure={() => handleConfigureIntegration(integration.id)}
                onToggle={() => handleToggleIntegration(integration.id)}
                icon={getIntegrationIcon(integration.type)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <ActivityLogs 
            logs={logs}
            onRefresh={loadData}
            onViewDetails={setSelectedLog}
          />
        </TabsContent>

        <TabsContent value="tester">
          <IntegrationTester integrations={integrations} />
        </TabsContent>
      </Tabs>
    </div>
  );
}