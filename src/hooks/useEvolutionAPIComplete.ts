import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EvolutionAPIService, type EvolutionAPIResponse } from '@/services/evolution-api-complete';
import { logger } from '@/utils/logger';

interface GlobalConfig {
  server_url: string;
  api_key: string;
  ativo: boolean;
}

/**
 * Hook principal para Evolution API v2 completa
 * Gerencia configuração global e fornece acesso a todas as funcionalidades
 */
export function useEvolutionAPIComplete() {
  const [config, setConfig] = useState<GlobalConfig | null>(null);
  const [service, setService] = useState<EvolutionAPIService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Carrega configuração global da Evolution API
  const loadGlobalConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: configError } = await supabase
        .from('evolution_api_global_config')
        .select('server_url, api_key, ativo')
        .eq('ativo', true)
        .single();

      if (configError) {
        if (configError.code === 'PGRST116') {
          throw new Error('Configuração global da Evolution API não encontrada');
        }
        throw configError;
      }

      setConfig(data);
      setService(new EvolutionAPIService(data.server_url, data.api_key));

      logger.info('Configuração Evolution API carregada', {
        component: 'useEvolutionAPIComplete'
      });
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      logger.error('Erro ao carregar configuração Evolution API', {
        component: 'useEvolutionAPIComplete'
      }, err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verifica se o serviço está disponível
  const isServiceAvailable = useCallback(() => {
    return service !== null && config !== null;
  }, [service, config]);

  // Wrapper para executar operações com tratamento de erro
  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<EvolutionAPIResponse<T>>,
    operationName: string
  ): Promise<T | null> => {
    if (!isServiceAvailable()) {
      toast({
        title: "Serviço indisponível",
        description: "Configuração da Evolution API não foi carregada",
        variant: "destructive",
      });
      return null;
    }

    try {
      const result = await operation();
      
      if (result.error) {
        throw new Error(result.error);
      }

      logger.info(`${operationName} executado com sucesso`, {
        component: 'useEvolutionAPIComplete'
      });

      return result.data || null;
    } catch (err) {
      const errorMessage = (err as Error).message;
      logger.error(`Erro em ${operationName}`, {
        component: 'useEvolutionAPIComplete'
      }, err as Error);
      
      toast({
        title: "Erro na operação",
        description: `${operationName}: ${errorMessage}`,
        variant: "destructive",
      });
      
      return null;
    }
  }, [isServiceAvailable, toast]);

  // ===== OPERAÇÕES DE INSTÂNCIA =====
  const createInstance = useCallback(async (instanceData: {
    instanceName: string;
    number?: string;
    webhook?: string;
    events?: string[];
  }) => {
    return executeWithErrorHandling(
      () => service!.createInstance({
        instanceName: instanceData.instanceName,
        token: instanceData.instanceName,
        qrcode: true,
        number: instanceData.number,
        integration: "WHATSAPP-BAILEYS",
        webhook: instanceData.webhook || `${window.location.origin}/api/webhooks/evolution/${instanceData.instanceName}`,
        webhook_by_events: true,
        events: instanceData.events || ["APPLICATION_STARTUP", "MESSAGES_UPSERT", "MESSAGE_STATUS_UPDATE", "CONNECTION_UPDATE", "QRCODE_UPDATED"],
        reject_call: true,
        msg_call: "Chamadas não são atendidas",
        groups_ignore: true,
        always_online: true,
        read_messages: true,
        read_status: true,
        websocket_enabled: true,
        websocket_events: ["APPLICATION_STARTUP"]
      }),
      'Criar instância'
    );
  }, [service, executeWithErrorHandling]);

  const fetchInstances = useCallback(async () => {
    return executeWithErrorHandling(
      () => service!.fetchInstances(),
      'Buscar instâncias'
    );
  }, [service, executeWithErrorHandling]);

  const connectInstance = useCallback(async (instanceName: string) => {
    return executeWithErrorHandling(
      () => service!.connectInstance(instanceName),
      'Conectar instância'
    );
  }, [service, executeWithErrorHandling]);

  const restartInstance = useCallback(async (instanceName: string) => {
    return executeWithErrorHandling(
      () => service!.restartInstance(instanceName),
      'Reiniciar instância'
    );
  }, [service, executeWithErrorHandling]);

  const getConnectionState = useCallback(async (instanceName: string) => {
    return executeWithErrorHandling(
      () => service!.getConnectionState(instanceName),
      'Verificar estado da conexão'
    );
  }, [service, executeWithErrorHandling]);

  const deleteInstance = useCallback(async (instanceName: string) => {
    return executeWithErrorHandling(
      () => service!.deleteInstance(instanceName),
      'Deletar instância'
    );
  }, [service, executeWithErrorHandling]);

  // ===== OPERAÇÕES DE MENSAGEM =====
  const sendText = useCallback(async (instanceName: string, data: {
    number: string;
    text: string;
    delay?: number;
    linkPreview?: boolean;
  }) => {
    return executeWithErrorHandling(
      () => service!.sendText(instanceName, data),
      'Enviar mensagem de texto'
    );
  }, [service, executeWithErrorHandling]);

  const sendMedia = useCallback(async (instanceName: string, data: {
    number: string;
    media: string;
    caption?: string;
    filename?: string;
  }) => {
    return executeWithErrorHandling(
      () => service!.sendMedia(instanceName, data),
      'Enviar mídia'
    );
  }, [service, executeWithErrorHandling]);

  const sendAudio = useCallback(async (instanceName: string, data: {
    number: string;
    audio: string;
    caption?: string;
  }) => {
    return executeWithErrorHandling(
      () => service!.sendAudio(instanceName, data),
      'Enviar áudio'
    );
  }, [service, executeWithErrorHandling]);

  const sendLocation = useCallback(async (instanceName: string, data: {
    number: string;
    latitude: number;
    longitude: number;
    name?: string;
  }) => {
    return executeWithErrorHandling(
      () => service!.sendLocation(instanceName, data),
      'Enviar localização'
    );
  }, [service, executeWithErrorHandling]);

  const sendContact = useCallback(async (instanceName: string, data: {
    number: string;
    contact: { name: string; phone: string };
  }) => {
    return executeWithErrorHandling(
      () => service!.sendContact(instanceName, data),
      'Enviar contato'
    );
  }, [service, executeWithErrorHandling]);

  const sendList = useCallback(async (instanceName: string, data: {
    number: string;
    title: string;
    buttonText: string;
    sections: Array<{
      title: string;
      rows: Array<{
        title: string;
        description?: string;
        rowId?: string;
      }>;
    }>;
  }) => {
    return executeWithErrorHandling(
      () => service!.sendList(instanceName, data),
      'Enviar lista interativa'
    );
  }, [service, executeWithErrorHandling]);

  const sendPoll = useCallback(async (instanceName: string, data: {
    number: string;
    question: string;
    options: string[];
    multipleSelect?: boolean;
  }) => {
    return executeWithErrorHandling(
      () => service!.sendPoll(instanceName, data),
      'Enviar enquete'
    );
  }, [service, executeWithErrorHandling]);

  // ===== OPERAÇÕES DE CHAT =====
  const markMessageAsRead = useCallback(async (instanceName: string, messageId: string) => {
    return executeWithErrorHandling(
      () => service!.markMessageAsRead(instanceName, messageId),
      'Marcar mensagem como lida'
    );
  }, [service, executeWithErrorHandling]);

  const findMessages = useCallback(async (instanceName: string, data: {
    chatId: string;
    limit?: number;
    offset?: number;
  }) => {
    return executeWithErrorHandling(
      () => service!.findMessages(instanceName, data),
      'Buscar mensagens'
    );
  }, [service, executeWithErrorHandling]);

  const findChats = useCallback(async (instanceName: string) => {
    return executeWithErrorHandling(
      () => service!.findChats(instanceName),
      'Buscar chats'
    );
  }, [service, executeWithErrorHandling]);

  const checkIsWhatsApp = useCallback(async (instanceName: string, number: string) => {
    return executeWithErrorHandling(
      () => service!.checkIsWhatsApp(instanceName, number),
      'Verificar WhatsApp'
    );
  }, [service, executeWithErrorHandling]);

  // ===== OPERAÇÕES DE WEBHOOK =====
  const setWebhook = useCallback(async (instanceName: string, config: {
    url: string;
    events: string[];
    webhook_by_events?: boolean;
  }) => {
    return executeWithErrorHandling(
      () => service!.setWebhook(instanceName, config),
      'Configurar webhook'
    );
  }, [service, executeWithErrorHandling]);

  // ===== OPERAÇÕES DE PERFIL =====
  const updateProfileName = useCallback(async (instanceName: string, name: string) => {
    return executeWithErrorHandling(
      () => service!.updateProfileName(instanceName, name),
      'Atualizar nome do perfil'
    );
  }, [service, executeWithErrorHandling]);

  const updateProfileStatus = useCallback(async (instanceName: string, status: string) => {
    return executeWithErrorHandling(
      () => service!.updateProfileStatus(instanceName, status),
      'Atualizar status do perfil'
    );
  }, [service, executeWithErrorHandling]);

  // ===== OPERAÇÕES DE GRUPO =====
  const createGroup = useCallback(async (instanceName: string, data: {
    subject: string;
    participants: string[];
    description?: string;
  }) => {
    return executeWithErrorHandling(
      () => service!.createGroup(instanceName, data),
      'Criar grupo'
    );
  }, [service, executeWithErrorHandling]);

  const fetchAllGroups = useCallback(async (instanceName: string) => {
    return executeWithErrorHandling(
      () => service!.fetchAllGroups(instanceName),
      'Buscar todos os grupos'
    );
  }, [service, executeWithErrorHandling]);

  // Carrega configuração ao montar o hook
  useEffect(() => {
    loadGlobalConfig();
  }, [loadGlobalConfig]);

  return {
    // Estado
    config,
    service,
    loading,
    error,
    isServiceAvailable: isServiceAvailable(),

    // Operações de configuração
    loadGlobalConfig,

    // Operações de instância
    createInstance,
    fetchInstances,
    connectInstance,
    restartInstance,
    getConnectionState,
    deleteInstance,

    // Operações de mensagem
    sendText,
    sendMedia,
    sendAudio,
    sendLocation,
    sendContact,
    sendList,
    sendPoll,

    // Operações de chat
    markMessageAsRead,
    findMessages,
    findChats,
    checkIsWhatsApp,

    // Operações de webhook
    setWebhook,

    // Operações de perfil
    updateProfileName,
    updateProfileStatus,

    // Operações de grupo
    createGroup,
    fetchAllGroups,
  };
}

export default useEvolutionAPIComplete;