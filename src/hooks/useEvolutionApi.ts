import { useState, useCallback, useEffect } from 'react';
import { EvolutionApiService } from '@/services/evolution-api';
import { EvolutionApiConfig, EvolutionApiStatus, EvolutionApiResponse } from '@/types/evolution-api';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseEvolutionApiReturn {
  evolutionApi: EvolutionApiService | null;
  status: EvolutionApiStatus;
  isConfigured: boolean;
  config: EvolutionApiConfig | null;
  loading: boolean;
  conectando: boolean;
  configure: (config: EvolutionApiConfig) => void;
  sendMessage: (phone: string, message: string) => Promise<boolean>;
  sendTextMessage: (phone: string, message: string) => Promise<boolean>;
  sendMediaMessage: (phone: string, mediaUrl: string, mediaType: string, caption?: string, fileName?: string) => Promise<boolean>;
  sendButtonMessage: (phone: string, text: string, buttons: Array<{ id: string; text: string }>, footer?: string) => Promise<boolean>;
  sendListMessage: (
    phone: string, 
    title: string, 
    description: string, 
    buttonText: string,
    sections: Array<{
      title: string;
      rows: Array<{ id: string; title: string; description?: string }>;
    }>,
    footerText?: string
  ) => Promise<boolean>;
  sendImageMessage: (phone: string, imageUrl: string, caption?: string) => Promise<boolean>;
  sendDocumentMessage: (phone: string, documentUrl: string, fileName: string) => Promise<boolean>;
  sendAudioMessage: (phone: string, audioUrl: string) => Promise<boolean>;
  sendVideoMessage: (phone: string, videoUrl: string, caption?: string) => Promise<boolean>;
  checkStatus: () => Promise<void>;
  verificarStatus: () => Promise<any>;
  getQRCode: () => Promise<string | null>;
  obterQRCode: () => Promise<any>;
  // Novos métodos implementados
  getWebhook: () => Promise<EvolutionApiResponse>;
  setSettings: (settings: any) => Promise<EvolutionApiResponse>;
  getSettings: () => Promise<EvolutionApiResponse>;
  sendStatus: (text: string, backgroundColor?: string, font?: number, statusTextColor?: string) => Promise<boolean>;
  sendSticker: (phone: string, stickerUrl: string) => Promise<boolean>;
  sendLocation: (phone: string, latitude: number, longitude: number, name?: string, address?: string) => Promise<boolean>;
  sendContact: (phone: string, contactPhone: string, contactName: string) => Promise<boolean>;
  sendReaction: (phone: string, messageId: string, emoji: string) => Promise<boolean>;
  sendPoll: (phone: string, name: string, selectableCount: number, values: string[]) => Promise<boolean>;
  checkWhatsApp: (phones: string[]) => Promise<EvolutionApiResponse>;
  markMessageAsRead: (phone: string, messageIds: string[]) => Promise<boolean>;
  archiveChat: (phone: string, archive?: boolean) => Promise<boolean>;
  deleteMessageForEveryone: (phone: string, messageId: string) => Promise<boolean>;
  sendPresence: (phone: string, presence: 'unavailable' | 'available' | 'composing' | 'recording') => Promise<boolean>;
  fetchProfilePictureUrl: (phone: string) => Promise<EvolutionApiResponse>;
  findContacts: () => Promise<EvolutionApiResponse>;
  findMessages: (phone: string, limit?: number) => Promise<EvolutionApiResponse>;
  findStatusMessage: () => Promise<EvolutionApiResponse>;
  updateMessage: (phone: string, messageId: string, text: string) => Promise<boolean>;
  findChats: () => Promise<EvolutionApiResponse>;
  fetchBusinessProfile: (phone: string) => Promise<EvolutionApiResponse>;
  fetchProfile: (phone: string) => Promise<EvolutionApiResponse>;
  updateProfileName: (name: string) => Promise<boolean>;
  updateProfileStatus: (status: string) => Promise<boolean>;
  updateProfilePicture: (pictureUrl: string) => Promise<boolean>;
  removeProfilePicture: () => Promise<boolean>;
  fetchPrivacySettings: () => Promise<EvolutionApiResponse>;
  updatePrivacySettings: (settings: any) => Promise<boolean>;
  createGroup: (subject: string, participants: string[], description?: string) => Promise<boolean>;
  updateGroupPicture: (groupJid: string, pictureUrl: string) => Promise<boolean>;
  updateGroupSubject: (groupJid: string, subject: string) => Promise<boolean>;
  updateGroupDescription: (groupJid: string, description: string) => Promise<boolean>;
  fetchInviteCode: (groupJid: string) => Promise<EvolutionApiResponse>;
  acceptInviteCode: (inviteCode: string) => Promise<boolean>;
  revokeInviteCode: (groupJid: string) => Promise<boolean>;
  sendGroupInvite: (groupJid: string, phoneNumbers: string[], inviteCode: string, inviteExpiration?: number) => Promise<boolean>;
  findGroupByInviteCode: (inviteCode: string) => Promise<EvolutionApiResponse>;
  findGroupByJid: (groupJid: string) => Promise<EvolutionApiResponse>;
  fetchAllGroups: () => Promise<EvolutionApiResponse>;
  findGroupMembers: (groupJid: string) => Promise<EvolutionApiResponse>;
  updateGroupMembers: (groupJid: string, action: 'add' | 'remove' | 'promote' | 'demote', participants: string[]) => Promise<boolean>;
  updateGroupSetting: (groupJid: string, action: 'announcement' | 'not_announcement' | 'locked' | 'unlocked') => Promise<boolean>;
  toggleEphemeral: (groupJid: string, expiration: number) => Promise<boolean>;
  leaveGroup: (groupJid: string) => Promise<boolean>;
  connectInstance: () => Promise<boolean>;
  restartInstance: () => Promise<boolean>;
  logoutInstance: () => Promise<boolean>;
  setWebhook: (webhookUrl: string, events?: string[]) => Promise<boolean>;
  configurarWebhook: () => Promise<boolean>;
  disconnect: () => void;
}

export function useEvolutionApi(): UseEvolutionApiReturn {
  const [evolutionApi, setEvolutionApi] = useState<EvolutionApiService | null>(null);
  const [config, setConfig] = useState<EvolutionApiConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [conectando, setConectando] = useState(false);
  const [status, setStatus] = useState<EvolutionApiStatus>({
    connected: false,
    instanceStatus: 'disconnected',
    lastCheck: null,
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  // Carregar configuração do banco de dados
  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('evolution_api_config')
        .select('*')
        .eq('ativo', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        // Get global config for API key and server URL
        const { data: globalConfig } = await supabase
          .from('evolution_api_global_config')
          .select('api_key, server_url')
          .eq('ativo', true)
          .single();

        if (globalConfig) {
          const evolutionConfig: EvolutionApiConfig = {
            apiKey: globalConfig.api_key,
            serverUrl: globalConfig.server_url,
            instanceName: data.instance_name,
            webhookUrl: data.webhook_url,
            webhookEvents: data.webhook_events
          };
          setConfig(evolutionConfig);
          configure(evolutionConfig);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configuração Evolution API:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar configuração ao inicializar
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const configure = useCallback((config: EvolutionApiConfig) => {
    console.log('Configurando Evolution API:', config);
    
    const evolutionApiService = new EvolutionApiService(config);
    setEvolutionApi(evolutionApiService);
    setConfig(config);
    setIsConfigured(true);
    
    // Verificar status inicial
    checkStatusInternal(evolutionApiService);
  }, []);

  const checkStatusInternal = async (service: EvolutionApiService) => {
    try {
      const statusResponse = await service.getInstanceStatus();
      console.log('Status Evolution API:', statusResponse);
      
      const connected = statusResponse.data?.instance?.state === 'open';
      
      setStatus({
        connected,
        instanceStatus: statusResponse.data?.instance?.state || 'unknown',
        lastCheck: new Date(),
      });
    } catch (error) {
      console.error('Erro ao verificar status Evolution API:', error);
      setStatus(prev => ({
        ...prev,
        connected: false,
        instanceStatus: 'error',
        lastCheck: new Date(),
      }));
    }
  };

  const checkStatus = useCallback(async () => {
    if (!evolutionApi) return;
    await checkStatusInternal(evolutionApi);
  }, [evolutionApi]);

  const verificarStatus = useCallback(async () => {
    if (!evolutionApi) return { value: false, status: 'disconnected' };
    
    try {
      const response = await evolutionApi.getInstanceStatus();
      return {
        value: response.data?.instance?.state === 'open',
        status: response.data?.instance?.state || 'disconnected'
      };
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return { value: false, status: 'error' };
    }
  }, [evolutionApi]);

  const obterQRCode = useCallback(async () => {
    if (!evolutionApi) return { qrcode: null };
    
    try {
      setConectando(true);
      const response = await evolutionApi.getQRCode();
      return {
        qrcode: response.data?.qrcode || response.qrcode || null
      };
    } catch (error) {
      console.error('Erro ao obter QR Code:', error);
      return { qrcode: null };
    } finally {
      setConectando(false);
    }
  }, [evolutionApi]);

  const configurarWebhook = useCallback(async (): Promise<boolean> => {
    if (!evolutionApi || !config?.webhookUrl) return false;

    try {
      const response = await evolutionApi.setWebhook(config.webhookUrl, config.webhookEvents);
      return !!(response.success || response.webhook);
    } catch (error) {
      console.error('Erro ao configurar webhook:', error);
      return false;
    }
  }, [evolutionApi, config]);

  const sendTextMessage = useCallback(async (phone: string, message: string): Promise<boolean> => {
    return sendMessage(phone, message);
  }, []);

  const sendMediaMessage = useCallback(async (phone: string, mediaUrl: string, mediaType: string, caption?: string, fileName?: string): Promise<boolean> => {
    if (!evolutionApi) return false;

    try {
      let response;
      switch (mediaType) {
        case 'image':
          response = await evolutionApi.sendImageMessage(phone, mediaUrl, caption);
          break;
        case 'document':
          response = await evolutionApi.sendDocumentMessage(phone, mediaUrl, fileName || 'document');
          break;
        case 'audio':
          response = await evolutionApi.sendAudioMessage(phone, mediaUrl);
          break;
        case 'video':
          response = await evolutionApi.sendVideoMessage(phone, mediaUrl, caption);
          break;
        default:
          return false;
      }
      return !!(response.success || response.key);
    } catch (error) {
      console.error('Erro ao enviar mídia:', error);
      return false;
    }
  }, [evolutionApi]);

  const sendMessage = useCallback(async (phone: string, message: string): Promise<boolean> => {
    if (!evolutionApi) {
      toast({
        title: "Evolution API não configurada",
        description: "Configure a integração Evolution API primeiro",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await evolutionApi.sendTextMessage(phone, message);
      return !!(response.success || response.key);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar a mensagem via Evolution API",
        variant: "destructive",
      });
      return false;
    }
  }, [evolutionApi, toast]);

  const sendButtonMessage = useCallback(async (
    phone: string, 
    text: string, 
    buttons: Array<{ id: string; text: string }>, 
    footer?: string
  ): Promise<boolean> => {
    if (!evolutionApi) {
      toast({
        title: "Evolution API não configurada",
        description: "Configure a integração Evolution API primeiro",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await evolutionApi.sendButtonMessage(phone, text, buttons, footer);
      return !!(response.success || response.key);
    } catch (error) {
      console.error('Erro ao enviar mensagem com botões:', error);
      toast({
        title: "Erro ao enviar botões",
        description: "Não foi possível enviar a mensagem com botões via Evolution API",
        variant: "destructive",
      });
      return false;
    }
  }, [evolutionApi, toast]);

  const sendListMessage = useCallback(async (
    phone: string, 
    title: string, 
    description: string, 
    buttonText: string,
    sections: Array<{
      title: string;
      rows: Array<{ id: string; title: string; description?: string }>;
    }>,
    footerText?: string
  ): Promise<boolean> => {
    if (!evolutionApi) {
      toast({
        title: "Evolution API não configurada",
        description: "Configure a integração Evolution API primeiro",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await evolutionApi.sendListMessage(phone, title, description, buttonText, sections, footerText);
      return !!(response.success || response.key);
    } catch (error) {
      console.error('Erro ao enviar lista:', error);
      toast({
        title: "Erro ao enviar lista",
        description: "Não foi possível enviar a mensagem com lista via Evolution API",
        variant: "destructive",
      });
      return false;
    }
  }, [evolutionApi, toast]);

  const sendImageMessage = useCallback(async (phone: string, imageUrl: string, caption?: string): Promise<boolean> => {
    if (!evolutionApi) {
      toast({
        title: "Evolution API não configurada",
        description: "Configure a integração Evolution API primeiro",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await evolutionApi.sendImageMessage(phone, imageUrl, caption);
      return !!(response.success || response.key);
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      toast({
        title: "Erro ao enviar imagem",
        description: "Não foi possível enviar a imagem via Evolution API",
        variant: "destructive",
      });
      return false;
    }
  }, [evolutionApi, toast]);

  const sendDocumentMessage = useCallback(async (phone: string, documentUrl: string, fileName: string): Promise<boolean> => {
    if (!evolutionApi) {
      toast({
        title: "Evolution API não configurada",
        description: "Configure a integração Evolution API primeiro",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await evolutionApi.sendDocumentMessage(phone, documentUrl, fileName);
      return !!(response.success || response.key);
    } catch (error) {
      console.error('Erro ao enviar documento:', error);
      toast({
        title: "Erro ao enviar documento",
        description: "Não foi possível enviar o documento via Evolution API",
        variant: "destructive",
      });
      return false;
    }
  }, [evolutionApi, toast]);

  const sendAudioMessage = useCallback(async (phone: string, audioUrl: string): Promise<boolean> => {
    if (!evolutionApi) {
      toast({
        title: "Evolution API não configurada",
        description: "Configure a integração Evolution API primeiro",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await evolutionApi.sendAudioMessage(phone, audioUrl);
      return !!(response.success || response.key);
    } catch (error) {
      console.error('Erro ao enviar áudio:', error);
      toast({
        title: "Erro ao enviar áudio",
        description: "Não foi possível enviar o áudio via Evolution API",
        variant: "destructive",
      });
      return false;
    }
  }, [evolutionApi, toast]);

  const sendVideoMessage = useCallback(async (phone: string, videoUrl: string, caption?: string): Promise<boolean> => {
    if (!evolutionApi) {
      toast({
        title: "Evolution API não configurada",
        description: "Configure a integração Evolution API primeiro",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await evolutionApi.sendVideoMessage(phone, videoUrl, caption);
      return !!(response.success || response.key);
    } catch (error) {
      console.error('Erro ao enviar vídeo:', error);
      toast({
        title: "Erro ao enviar vídeo",
        description: "Não foi possível enviar o vídeo via Evolution API",
        variant: "destructive",
      });
      return false;
    }
  }, [evolutionApi, toast]);

  const getQRCode = useCallback(async (): Promise<string | null> => {
    if (!evolutionApi) return null;

    try {
      const response = await evolutionApi.getQRCode();
      return response.data?.qrcode || response.qrcode || null;
    } catch (error) {
      console.error('Erro ao obter QR Code:', error);
      return null;
    }
  }, [evolutionApi]);

  // Implementação dos novos métodos
  const getWebhook = useCallback(async () => {
    if (!evolutionApi) return { error: "Evolution API não configurada" };
    try {
      return await evolutionApi.getWebhook();
    } catch (error) {
      console.error('Erro ao buscar webhook:', error);
      return { error: "Erro ao buscar webhook" };
    }
  }, [evolutionApi]);

  const setSettings = useCallback(async (settings: any) => {
    if (!evolutionApi) return { error: "Evolution API não configurada" };
    try {
      return await evolutionApi.setSettings(settings);
    } catch (error) {
      console.error('Erro ao definir configurações:', error);
      return { error: "Erro ao definir configurações" };
    }
  }, [evolutionApi]);

  const getSettings = useCallback(async () => {
    if (!evolutionApi) return { error: "Evolution API não configurada" };
    try {
      return await evolutionApi.getSettings();
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      return { error: "Erro ao buscar configurações" };
    }
  }, [evolutionApi]);

  const sendStatus = useCallback(async (text: string, backgroundColor?: string, font?: number, statusTextColor?: string): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.sendStatus(text, backgroundColor, font, statusTextColor);
      return !!(response.success || response.key);
    } catch (error) {
      console.error('Erro ao enviar status:', error);
      return false;
    }
  }, [evolutionApi]);

  const sendSticker = useCallback(async (phone: string, stickerUrl: string): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.sendSticker(phone, stickerUrl);
      return !!(response.success || response.key);
    } catch (error) {
      console.error('Erro ao enviar sticker:', error);
      return false;
    }
  }, [evolutionApi]);

  const sendLocation = useCallback(async (phone: string, latitude: number, longitude: number, name?: string, address?: string): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.sendLocation(phone, latitude, longitude, name, address);
      return !!(response.success || response.key);
    } catch (error) {
      console.error('Erro ao enviar localização:', error);
      return false;
    }
  }, [evolutionApi]);

  const sendContact = useCallback(async (phone: string, contactPhone: string, contactName: string): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.sendContact(phone, contactPhone, contactName);
      return !!(response.success || response.key);
    } catch (error) {
      console.error('Erro ao enviar contato:', error);
      return false;
    }
  }, [evolutionApi]);

  const sendReaction = useCallback(async (phone: string, messageId: string, emoji: string): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.sendReaction(phone, messageId, emoji);
      return !!(response.success || response.key);
    } catch (error) {
      console.error('Erro ao enviar reação:', error);
      return false;
    }
  }, [evolutionApi]);

  const sendPoll = useCallback(async (phone: string, name: string, selectableCount: number, values: string[]): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.sendPoll(phone, name, selectableCount, values);
      return !!(response.success || response.key);
    } catch (error) {
      console.error('Erro ao enviar enquete:', error);
      return false;
    }
  }, [evolutionApi]);

  const checkWhatsApp = useCallback(async (phones: string[]) => {
    if (!evolutionApi) return { error: "Evolution API não configurada" };
    try {
      return await evolutionApi.checkWhatsApp(phones);
    } catch (error) {
      console.error('Erro ao verificar números WhatsApp:', error);
      return { error: "Erro ao verificar números WhatsApp" };
    }
  }, [evolutionApi]);

  const markMessageAsRead = useCallback(async (phone: string, messageIds: string[]): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.markMessageAsRead(phone, messageIds);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas:', error);
      return false;
    }
  }, [evolutionApi]);

  const archiveChat = useCallback(async (phone: string, archive: boolean = true): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.archiveChat(phone, archive);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao arquivar chat:', error);
      return false;
    }
  }, [evolutionApi]);

  const deleteMessageForEveryone = useCallback(async (phone: string, messageId: string): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.deleteMessageForEveryone(phone, messageId);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error);
      return false;
    }
  }, [evolutionApi]);

  const sendPresence = useCallback(async (phone: string, presence: 'unavailable' | 'available' | 'composing' | 'recording'): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.sendPresence(phone, presence);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao enviar presença:', error);
      return false;
    }
  }, [evolutionApi]);

  const fetchProfilePictureUrl = useCallback(async (phone: string) => {
    if (!evolutionApi) return { error: "Evolution API não configurada" };
    try {
      return await evolutionApi.fetchProfilePictureUrl(phone);
    } catch (error) {
      console.error('Erro ao buscar foto de perfil:', error);
      return { error: "Erro ao buscar foto de perfil" };
    }
  }, [evolutionApi]);

  const findContacts = useCallback(async () => {
    if (!evolutionApi) return { error: "Evolution API não configurada" };
    try {
      return await evolutionApi.findContacts();
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      return { error: "Erro ao buscar contatos" };
    }
  }, [evolutionApi]);

  const findMessages = useCallback(async (phone: string, limit?: number) => {
    if (!evolutionApi) return { error: "Evolution API não configurada" };
    try {
      return await evolutionApi.findMessages(phone, limit);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      return { error: "Erro ao buscar mensagens" };
    }
  }, [evolutionApi]);

  const findStatusMessage = useCallback(async () => {
    if (!evolutionApi) return { error: "Evolution API não configurada" };
    try {
      return await evolutionApi.findStatusMessage();
    } catch (error) {
      console.error('Erro ao buscar status:', error);
      return { error: "Erro ao buscar status" };
    }
  }, [evolutionApi]);

  const updateMessage = useCallback(async (phone: string, messageId: string, text: string): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.updateMessage(phone, messageId, text);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao atualizar mensagem:', error);
      return false;
    }
  }, [evolutionApi]);

  const findChats = useCallback(async () => {
    if (!evolutionApi) return { error: "Evolution API não configurada" };
    try {
      return await evolutionApi.findChats();
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
      return { error: "Erro ao buscar chats" };
    }
  }, [evolutionApi]);

  const fetchBusinessProfile = useCallback(async (phone: string) => {
    if (!evolutionApi) return { error: "Evolution API não configurada" };
    try {
      return await evolutionApi.fetchBusinessProfile(phone);
    } catch (error) {
      console.error('Erro ao buscar perfil comercial:', error);
      return { error: "Erro ao buscar perfil comercial" };
    }
  }, [evolutionApi]);

  const fetchProfile = useCallback(async (phone: string) => {
    if (!evolutionApi) return { error: "Evolution API não configurada" };
    try {
      return await evolutionApi.fetchProfile(phone);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return { error: "Erro ao buscar perfil" };
    }
  }, [evolutionApi]);

  const updateProfileName = useCallback(async (name: string): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.updateProfileName(name);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao atualizar nome do perfil:', error);
      return false;
    }
  }, [evolutionApi]);

  const updateProfileStatus = useCallback(async (status: string): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.updateProfileStatus(status);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao atualizar status do perfil:', error);
      return false;
    }
  }, [evolutionApi]);

  const updateProfilePicture = useCallback(async (pictureUrl: string): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.updateProfilePicture(pictureUrl);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao atualizar foto do perfil:', error);
      return false;
    }
  }, [evolutionApi]);

  const removeProfilePicture = useCallback(async (): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.removeProfilePicture();
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao remover foto do perfil:', error);
      return false;
    }
  }, [evolutionApi]);

  const fetchPrivacySettings = useCallback(async () => {
    if (!evolutionApi) return { error: "Evolution API não configurada" };
    try {
      return await evolutionApi.fetchPrivacySettings();
    } catch (error) {
      console.error('Erro ao buscar configurações de privacidade:', error);
      return { error: "Erro ao buscar configurações de privacidade" };
    }
  }, [evolutionApi]);

  const updatePrivacySettings = useCallback(async (settings: any): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.updatePrivacySettings(settings);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao atualizar configurações de privacidade:', error);
      return false;
    }
  }, [evolutionApi]);

  const createGroup = useCallback(async (subject: string, participants: string[], description?: string): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.createGroup(subject, participants, description);
      return !!(response.success || response.data?.groupJid);
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      return false;
    }
  }, [evolutionApi]);

  const updateGroupPicture = useCallback(async (groupJid: string, pictureUrl: string): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.updateGroupPicture(groupJid, pictureUrl);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao atualizar foto do grupo:', error);
      return false;
    }
  }, [evolutionApi]);

  const updateGroupSubject = useCallback(async (groupJid: string, subject: string): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.updateGroupSubject(groupJid, subject);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao atualizar título do grupo:', error);
      return false;
    }
  }, [evolutionApi]);

  const updateGroupDescription = useCallback(async (groupJid: string, description: string): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.updateGroupDescription(groupJid, description);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao atualizar descrição do grupo:', error);
      return false;
    }
  }, [evolutionApi]);

  const fetchInviteCode = useCallback(async (groupJid: string) => {
    if (!evolutionApi) return { error: "Evolution API não configurada" };
    try {
      return await evolutionApi.fetchInviteCode(groupJid);
    } catch (error) {
      console.error('Erro ao buscar código de convite:', error);
      return { error: "Erro ao buscar código de convite" };
    }
  }, [evolutionApi]);

  const acceptInviteCode = useCallback(async (inviteCode: string): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.acceptInviteCode(inviteCode);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao aceitar convite:', error);
      return false;
    }
  }, [evolutionApi]);

  const revokeInviteCode = useCallback(async (groupJid: string): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.revokeInviteCode(groupJid);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao revogar código de convite:', error);
      return false;
    }
  }, [evolutionApi]);

  const sendGroupInvite = useCallback(async (groupJid: string, phoneNumbers: string[], inviteCode: string, inviteExpiration?: number): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.sendGroupInvite(groupJid, phoneNumbers, inviteCode, inviteExpiration);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao enviar convites:', error);
      return false;
    }
  }, [evolutionApi]);

  const findGroupByInviteCode = useCallback(async (inviteCode: string) => {
    if (!evolutionApi) return { error: "Evolution API não configurada" };
    try {
      return await evolutionApi.findGroupByInviteCode(inviteCode);
    } catch (error) {
      console.error('Erro ao buscar grupo por convite:', error);
      return { error: "Erro ao buscar grupo por convite" };
    }
  }, [evolutionApi]);

  const findGroupByJid = useCallback(async (groupJid: string) => {
    if (!evolutionApi) return { error: "Evolution API não configurada" };
    try {
      return await evolutionApi.findGroupByJid(groupJid);
    } catch (error) {
      console.error('Erro ao buscar grupo por JID:', error);
      return { error: "Erro ao buscar grupo por JID" };
    }
  }, [evolutionApi]);

  const fetchAllGroups = useCallback(async () => {
    if (!evolutionApi) return { error: "Evolution API não configurada" };
    try {
      return await evolutionApi.fetchAllGroups();
    } catch (error) {
      console.error('Erro ao buscar todos os grupos:', error);
      return { error: "Erro ao buscar todos os grupos" };
    }
  }, [evolutionApi]);

  const findGroupMembers = useCallback(async (groupJid: string) => {
    if (!evolutionApi) return { error: "Evolution API não configurada" };
    try {
      return await evolutionApi.findGroupMembers(groupJid);
    } catch (error) {
      console.error('Erro ao buscar membros do grupo:', error);
      return { error: "Erro ao buscar membros do grupo" };
    }
  }, [evolutionApi]);

  const updateGroupMembers = useCallback(async (groupJid: string, action: 'add' | 'remove' | 'promote' | 'demote', participants: string[]): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.updateGroupMembers(groupJid, action, participants);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao atualizar membros do grupo:', error);
      return false;
    }
  }, [evolutionApi]);

  const updateGroupSetting = useCallback(async (groupJid: string, action: 'announcement' | 'not_announcement' | 'locked' | 'unlocked'): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.updateGroupSetting(groupJid, action);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao atualizar configuração do grupo:', error);
      return false;
    }
  }, [evolutionApi]);

  const toggleEphemeral = useCallback(async (groupJid: string, expiration: number): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.toggleEphemeral(groupJid, expiration);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao alterar mensagens temporárias:', error);
      return false;
    }
  }, [evolutionApi]);

  const leaveGroup = useCallback(async (groupJid: string): Promise<boolean> => {
    if (!evolutionApi) return false;
    try {
      const response = await evolutionApi.leaveGroup(groupJid);
      return !!(response.success);
    } catch (error) {
      console.error('Erro ao sair do grupo:', error);
      return false;
    }
  }, [evolutionApi]);

  const connectInstance = useCallback(async (): Promise<boolean> => {
    if (!evolutionApi) {
      toast({
        title: "Evolution API não configurada",
        description: "Configure a integração Evolution API primeiro",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await evolutionApi.connectInstance();
      if (response.success || response.instance) {
        toast({
          title: "Conectando instância",
          description: "Iniciando conexão com WhatsApp",
        });
        await checkStatus();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao conectar instância:', error);
      toast({
        title: "Erro ao conectar",
        description: "Não foi possível conectar a instância",
        variant: "destructive",
      });
      return false;
    }
  }, [evolutionApi, toast, checkStatus]);

  const setWebhook = useCallback(async (webhookUrl: string, events?: string[]): Promise<boolean> => {
    if (!evolutionApi) {
      toast({
        title: "Evolution API não configurada",
        description: "Configure a integração Evolution API primeiro",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await evolutionApi.setWebhook(webhookUrl, events);
      if (response.success || response.webhook) {
        toast({
          title: "Webhook configurado",
          description: "Webhook configurado com sucesso",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao configurar webhook:', error);
      toast({
        title: "Erro ao configurar webhook",
        description: "Não foi possível configurar o webhook",
        variant: "destructive",
      });
      return false;
    }
  }, [evolutionApi, toast]);

  const restartInstance = useCallback(async (): Promise<boolean> => {
    if (!evolutionApi) return false;

    try {
      const response = await evolutionApi.restartInstance();
      if (response.success) {
        toast({
          title: "Instância reiniciada",
          description: "Instância reiniciada com sucesso",
        });
        await checkStatus();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao reiniciar instância:', error);
      toast({
        title: "Erro ao reiniciar",
        description: "Não foi possível reiniciar a instância",
        variant: "destructive",
      });
      return false;
    }
  }, [evolutionApi, toast, checkStatus]);

  const logoutInstance = useCallback(async (): Promise<boolean> => {
    if (!evolutionApi) return false;

    try {
      const response = await evolutionApi.logoutInstance();
      if (response.success) {
        toast({
          title: "Logout realizado",
          description: "Logout da instância realizado com sucesso",
        });
        await checkStatus();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro ao fazer logout",
        description: "Não foi possível fazer logout da instância",
        variant: "destructive",
      });
      return false;
    }
  }, [evolutionApi, toast, checkStatus]);

  const disconnect = useCallback(() => {
    setEvolutionApi(null);
    setIsConfigured(false);
    setConfig(null);
    setStatus({
      connected: false,
      instanceStatus: 'disconnected',
      lastCheck: null,
    });
    
    toast({
      title: "Evolution API desconectada",
      description: "A integração foi desconectada com sucesso",
    });
  }, [toast]);

  return {
    evolutionApi,
    status,
    isConfigured,
    config,
    loading,
    conectando,
    configure,
    sendMessage,
    sendTextMessage,
    sendMediaMessage,
    sendButtonMessage,
    sendListMessage,
    sendImageMessage,
    sendDocumentMessage,
    sendAudioMessage,
    sendVideoMessage,
    checkStatus,
    verificarStatus,
    getQRCode,
    obterQRCode,
    // Todos os novos métodos adicionados
    getWebhook,
    setSettings,
    getSettings,
    sendStatus,
    sendSticker,
    sendLocation,
    sendContact,
    sendReaction,
    sendPoll,
    checkWhatsApp,
    markMessageAsRead,
    archiveChat,
    deleteMessageForEveryone,
    sendPresence,
    fetchProfilePictureUrl,
    findContacts,
    findMessages,
    findStatusMessage,
    updateMessage,
    findChats,
    fetchBusinessProfile,
    fetchProfile,
    updateProfileName,
    updateProfileStatus,
    updateProfilePicture,
    removeProfilePicture,
    fetchPrivacySettings,
    updatePrivacySettings,
    createGroup,
    updateGroupPicture,
    updateGroupSubject,
    updateGroupDescription,
    fetchInviteCode,
    acceptInviteCode,
    revokeInviteCode,
    sendGroupInvite,
    findGroupByInviteCode,
    findGroupByJid,
    fetchAllGroups,
    findGroupMembers,
    updateGroupMembers,
    updateGroupSetting,
    toggleEphemeral,
    leaveGroup,
    connectInstance,
    restartInstance,
    logoutInstance,
    setWebhook,
    configurarWebhook,
    disconnect,
  };
}
