import { 
  EvolutionApiConfig,
  EvolutionApiMessage, 
  EvolutionApiMediaMessage,
  EvolutionApiButtonMessage,
  EvolutionApiListMessage,
  EvolutionApiWebhookMessage,
  ProcessedMessage,
  EvolutionApiResponse 
} from '@/types/evolution-api';

// Classe para Conexão Global Evolution API - Gerenciamento de Instâncias
class EvolutionApiGlobalService {
  private serverUrl: string;
  private apiKey: string;

  constructor(serverUrl: string, apiKey: string) {
    this.serverUrl = serverUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'apikey': this.apiKey,
    };
  }

  // CRUD de Instâncias - Operações Globais
  
  // Criar nova instância
  async createInstance(instanceName: string, webhookUrl?: string): Promise<EvolutionApiResponse> {
    console.log('Criando instância Evolution API:', instanceName);
    
    try {
      const payload: any = {
        instanceName,
        token: this.apiKey,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS'
      };

      // Configurar webhook se fornecido
      if (webhookUrl) {
        payload.webhook = webhookUrl;
        payload.webhook_by_events = false;
        payload.webhook_base64 = false;
        payload.events = ['MESSAGES_UPSERT', 'CONNECTION_UPDATE', 'QRCODE_UPDATED'];
      }

      const response = await fetch(`${this.serverUrl}/instance/create`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Resposta criação instância:', data);
      return data;
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      throw error;
    }
  }

  // Listar todas as instâncias
  async fetchInstances(): Promise<EvolutionApiResponse> {
    console.log('Buscando instâncias Evolution API');
    
    try {
      const response = await fetch(`${this.serverUrl}/instance/fetchInstances`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      console.log('Instâncias encontradas:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar instâncias:', error);
      throw error;
    }
  }

  // Deletar instância
  async deleteInstance(instanceName: string): Promise<EvolutionApiResponse> {
    console.log('Deletando instância:', instanceName);
    
    try {
      const response = await fetch(`${this.serverUrl}/instance/delete/${instanceName}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      console.log('Instância deletada:', data);
      return data;
    } catch (error) {
      console.error('Erro ao deletar instância:', error);
      throw error;
    }
  }

  // Obter status de uma instância específica
  async getInstanceStatus(instanceName: string): Promise<EvolutionApiResponse> {
    try {
      const response = await fetch(`${this.serverUrl}/instance/connectionState/${instanceName}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      console.log('Status da instância:', instanceName, data);
      return data;
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      throw error;
    }
  }

  // Reiniciar instância
  async restartInstance(instanceName: string): Promise<EvolutionApiResponse> {
    try {
      const response = await fetch(`${this.serverUrl}/instance/restart/${instanceName}`, {
        method: 'PUT',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      console.log('Instância reiniciada:', instanceName, data);
      return data;
    } catch (error) {
      console.error('Erro ao reiniciar instância:', error);
      throw error;
    }
  }

  // Configurar webhook para instância
  async setInstanceWebhook(instanceName: string, webhookUrl: string, events?: string[]): Promise<EvolutionApiResponse> {
    console.log('Configurando webhook para instância:', instanceName, webhookUrl);
    
    try {
      const payload = {
        url: webhookUrl,
        webhook_by_events: false,
        webhook_base64: false,
        events: events || ['MESSAGES_UPSERT', 'CONNECTION_UPDATE', 'QRCODE_UPDATED'],
      };

      const response = await fetch(`${this.serverUrl}/webhook/${instanceName}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Webhook configurado:', data);
      return data;
    } catch (error) {
      console.error('Erro ao configurar webhook:', error);
      throw error;
    }
  }
}

// Classe para operações específicas de uma instância
class EvolutionApiService {
  private config: EvolutionApiConfig;
  private baseUrl: string;

  constructor(config: EvolutionApiConfig) {
    this.config = config;
    this.baseUrl = config.serverUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'apikey': this.config.apiKey,
    };
  }

  private getUrl(endpoint: string) {
    return `${this.baseUrl}/${endpoint}/${this.config.instanceName}`;
  }

  // GET Find Webhook
  async getWebhook(): Promise<EvolutionApiResponse> {
    console.log('Buscando configuração de webhook:', this.config.instanceName);
    
    try {
      const response = await fetch(this.getUrl('webhook'), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      console.log('Configuração de webhook:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar webhook:', error);
      throw error;
    }
  }

  // POST Set Settings  
  async setSettings(settings: any): Promise<EvolutionApiResponse> {
    console.log('Definindo configurações da instância:', this.config.instanceName, settings);
    
    try {
      const response = await fetch(this.getUrl('settings'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      console.log('Configurações definidas:', data);
      return data;
    } catch (error) {
      console.error('Erro ao definir configurações:', error);
      throw error;
    }
  }

  // GET Find Settings
  async getSettings(): Promise<EvolutionApiResponse> {
    console.log('Buscando configurações da instância:', this.config.instanceName);
    
    try {
      const response = await fetch(this.getUrl('settings'), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      console.log('Configurações da instância:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      throw error;
    }
  }

  // Conectar instância
  async connectInstance(): Promise<EvolutionApiResponse> {
    console.log('Conectando instância:', this.config.instanceName);
    
    try {
      const response = await fetch(this.getUrl('instance/connect'), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      console.log('Resposta conexão:', data);
      return data;
    } catch (error) {
      console.error('Erro ao conectar instância:', error);
      throw error;
    }
  }

  // Obter status da instância
  async getInstanceStatus(): Promise<EvolutionApiResponse> {
    try {
      const response = await fetch(this.getUrl('instance/connectionState'), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      console.log('Status da instância:', data);
      return data;
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      throw error;
    }
  }

  // Obter QR Code
  async getQRCode(): Promise<EvolutionApiResponse> {
    try {
      const response = await fetch(this.getUrl('instance/qrcode'), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      console.log('QR Code obtido:', data);
      return data;
    } catch (error) {
      console.error('Erro ao obter QR Code:', error);
      throw error;
    }
  }

  // Enviar mensagem de texto
  async sendTextMessage(phone: string, text: string, options?: { delay?: number; linkPreview?: boolean }): Promise<EvolutionApiResponse> {
    console.log('Enviando mensagem via Evolution API:', { phone, text });
    
    try {
      const payload: EvolutionApiMessage = {
        number: phone.replace(/\D/g, ''), // Remove formatação
        text,
        delay: options?.delay || 0,
        linkPreview: options?.linkPreview || false,
      };

      const response = await fetch(this.getUrl('message/sendText'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Resposta Evolution API:', data);
      return data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  // Enviar mensagem com botões
  async sendButtonMessage(phone: string, text: string, buttons: Array<{ id: string; text: string }>, footer?: string): Promise<EvolutionApiResponse> {
    console.log('Enviando mensagem com botões:', { phone, text, buttons });
    
    try {
      const payload: EvolutionApiButtonMessage = {
        number: phone.replace(/\D/g, ''),
        buttonMessage: {
          text,
          buttons,
          footer,
        },
      };

      const response = await fetch(this.getUrl('message/sendButtons'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Resposta botões Evolution API:', data);
      return data;
    } catch (error) {
      console.error('Erro ao enviar mensagem com botões:', error);
      throw error;
    }
  }

  // Enviar mensagem com lista
  async sendListMessage(
    phone: string, 
    title: string, 
    description: string, 
    buttonText: string,
    sections: Array<{
      title: string;
      rows: Array<{ id: string; title: string; description?: string }>;
    }>,
    footerText?: string
  ): Promise<EvolutionApiResponse> {
    console.log('Enviando mensagem com lista:', { phone, title, sections });
    
    try {
      const payload: EvolutionApiListMessage = {
        number: phone.replace(/\D/g, ''),
        listMessage: {
          title,
          description,
          buttonText,
          sections,
          footerText,
        },
      };

      const response = await fetch(this.getUrl('message/sendList'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Resposta lista Evolution API:', data);
      return data;
    } catch (error) {
      console.error('Erro ao enviar mensagem com lista:', error);
      throw error;
    }
  }

  // Enviar imagem
  async sendImageMessage(phone: string, imageUrl: string, caption?: string): Promise<EvolutionApiResponse> {
    console.log('Enviando imagem via Evolution API:', { phone, imageUrl, caption });
    
    try {
      const payload: EvolutionApiMediaMessage = {
        number: phone.replace(/\D/g, ''),
        mediatype: 'image',
        media: imageUrl,
        caption: caption || '',
      };

      const response = await fetch(this.getUrl('message/sendMedia'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Resposta imagem Evolution API:', data);
      return data;
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      throw error;
    }
  }

  // Enviar documento
  async sendDocumentMessage(phone: string, documentUrl: string, fileName: string): Promise<EvolutionApiResponse> {
    console.log('Enviando documento via Evolution API:', { phone, documentUrl, fileName });
    
    try {
      const payload: EvolutionApiMediaMessage = {
        number: phone.replace(/\D/g, ''),
        mediatype: 'document',
        media: documentUrl,
        fileName,
      };

      const response = await fetch(this.getUrl('message/sendMedia'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Resposta documento Evolution API:', data);
      return data;
    } catch (error) {
      console.error('Erro ao enviar documento:', error);
      throw error;
    }
  }

  // Enviar áudio
  async sendAudioMessage(phone: string, audioUrl: string): Promise<EvolutionApiResponse> {
    console.log('Enviando áudio via Evolution API:', { phone, audioUrl });
    
    try {
      const payload: EvolutionApiMediaMessage = {
        number: phone.replace(/\D/g, ''),
        mediatype: 'audio',
        media: audioUrl,
      };

      const response = await fetch(this.getUrl('message/sendMedia'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Resposta áudio Evolution API:', data);
      return data;
    } catch (error) {
      console.error('Erro ao enviar áudio:', error);
      throw error;
    }
  }

  // Enviar vídeo
  async sendVideoMessage(phone: string, videoUrl: string, caption?: string): Promise<EvolutionApiResponse> {
    console.log('Enviando vídeo via Evolution API:', { phone, videoUrl, caption });
    
    try {
      const payload: EvolutionApiMediaMessage = {
        number: phone.replace(/\D/g, ''),
        mediatype: 'video',
        media: videoUrl,
        caption: caption || '',
      };

      const response = await fetch(this.getUrl('message/sendMedia'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Resposta vídeo Evolution API:', data);
      return data;
    } catch (error) {
      console.error('Erro ao enviar vídeo:', error);
      throw error;
    }
  }

  // Configurar webhook
  async setWebhook(webhookUrl: string, events?: string[]): Promise<EvolutionApiResponse> {
    console.log('Configurando webhook Evolution API:', webhookUrl);
    
    try {
      const payload = {
        url: webhookUrl,
        webhook_by_events: false,
        webhook_base64: false,
        events: events || ['MESSAGES_UPSERT', 'CONNECTION_UPDATE', 'QRCODE_UPDATED'],
      };

      const response = await fetch(this.getUrl('webhook'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Resposta webhook Evolution API:', data);
      return data;
    } catch (error) {
      console.error('Erro ao configurar webhook:', error);
      throw error;
    }
  }

  // Processar mensagem recebida do webhook
  processWebhookMessage(webhookData: EvolutionApiWebhookMessage): ProcessedMessage {
    console.log('Processando mensagem do webhook Evolution API:', webhookData);
    
    const data = webhookData.data;
    const processedMessage: ProcessedMessage = {
      id: data.key.id,
      phone: data.key.remoteJid.replace('@s.whatsapp.net', ''),
      fromMe: data.key.fromMe,
      timestamp: new Date(data.messageTimestamp * 1000),
      senderName: data.pushName || 'Cliente',
      type: 'text',
      content: '',
    };

    // Processar diferentes tipos de mensagem
    if (data.message?.conversation) {
      processedMessage.type = 'text';
      processedMessage.content = data.message.conversation;
    } else if (data.message?.extendedTextMessage) {
      processedMessage.type = 'text';
      processedMessage.content = data.message.extendedTextMessage.text;
    } else if (data.message?.imageMessage) {
      processedMessage.type = 'image';
      processedMessage.content = data.message.imageMessage.caption || '';
      processedMessage.attachment = {
        type: 'image',
        url: data.message.imageMessage.url,
        mimeType: data.message.imageMessage.mimetype,
      };
    } else if (data.message?.documentMessage) {
      processedMessage.type = 'document';
      processedMessage.content = data.message.documentMessage.title || data.message.documentMessage.fileName;
      processedMessage.attachment = {
        type: 'document',
        url: data.message.documentMessage.url,
        fileName: data.message.documentMessage.fileName,
        mimeType: data.message.documentMessage.mimetype,
      };
    } else if (data.message?.audioMessage) {
      processedMessage.type = 'audio';
      processedMessage.attachment = {
        type: 'audio',
        url: data.message.audioMessage.url,
        mimeType: data.message.audioMessage.mimetype,
      };
    } else if (data.message?.videoMessage) {
      processedMessage.type = 'video';
      processedMessage.content = data.message.videoMessage.caption || '';
      processedMessage.attachment = {
        type: 'video',
        url: data.message.videoMessage.url,
        mimeType: data.message.videoMessage.mimetype,
      };
    } else if (data.message?.buttonsResponseMessage) {
      processedMessage.type = 'button_response';
      processedMessage.content = data.message.buttonsResponseMessage.selectedDisplayText;
      processedMessage.buttonResponse = {
        selectedButtonId: data.message.buttonsResponseMessage.selectedButtonId,
        selectedDisplayText: data.message.buttonsResponseMessage.selectedDisplayText,
      };
    } else if (data.message?.listResponseMessage) {
      processedMessage.type = 'list_response';
      processedMessage.content = data.message.listResponseMessage.singleSelectReply.selectedRowId;
      processedMessage.listResponse = {
        selectedRowId: data.message.listResponseMessage.singleSelectReply.selectedRowId,
      };
    }

    return processedMessage;
  }

  // Reiniciar instância
  async restartInstance(): Promise<EvolutionApiResponse> {
    try {
      const response = await fetch(this.getUrl('instance/restart'), {
        method: 'PUT',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      console.log('Instância reiniciada:', data);
      return data;
    } catch (error) {
      console.error('Erro ao reiniciar instância:', error);
      throw error;
    }
  }

  // Logout da instância
  async logoutInstance(): Promise<EvolutionApiResponse> {
    try {
      const response = await fetch(this.getUrl('instance/logout'), {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      console.log('Logout realizado:', data);
      return data;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }

  // POST Send Status
  async sendStatus(text: string, backgroundColor?: string, font?: number, statusTextColor?: string): Promise<EvolutionApiResponse> {
    console.log('Enviando status via Evolution API:', text);
    
    try {
      const payload = {
        text,
        backgroundColor: backgroundColor || '#000000',
        font: font || 1,
        statusTextColor: statusTextColor || '#FFFFFF',
      };

      const response = await fetch(this.getUrl('message/sendStatus'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Resposta status Evolution API:', data);
      return data;
    } catch (error) {
      console.error('Erro ao enviar status:', error);
      throw error;
    }
  }

  // POST Send Sticker
  async sendSticker(phone: string, stickerUrl: string): Promise<EvolutionApiResponse> {
    console.log('Enviando sticker via Evolution API:', { phone, stickerUrl });
    
    try {
      const payload = {
        number: phone.replace(/\D/g, ''),
        sticker: stickerUrl,
      };

      const response = await fetch(this.getUrl('message/sendSticker'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Resposta sticker Evolution API:', data);
      return data;
    } catch (error) {
      console.error('Erro ao enviar sticker:', error);
      throw error;
    }
  }

  // POST Send Location
  async sendLocation(phone: string, latitude: number, longitude: number, name?: string, address?: string): Promise<EvolutionApiResponse> {
    console.log('Enviando localização via Evolution API:', { phone, latitude, longitude });
    
    try {
      const payload = {
        number: phone.replace(/\D/g, ''),
        latitude,
        longitude,
        name: name || 'Localização',
        address: address || '',
      };

      const response = await fetch(this.getUrl('message/sendLocation'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Resposta localização Evolution API:', data);
      return data;
    } catch (error) {
      console.error('Erro ao enviar localização:', error);
      throw error;
    }
  }

  // POST Send Contact
  async sendContact(phone: string, contactPhone: string, contactName: string): Promise<EvolutionApiResponse> {
    console.log('Enviando contato via Evolution API:', { phone, contactPhone, contactName });
    
    try {
      const payload = {
        number: phone.replace(/\D/g, ''),
        contact: {
          fullName: contactName,
          wuid: contactPhone.replace(/\D/g, ''),
          phoneNumber: contactPhone.replace(/\D/g, ''),
        },
      };

      const response = await fetch(this.getUrl('message/sendContact'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Resposta contato Evolution API:', data);
      return data;
    } catch (error) {
      console.error('Erro ao enviar contato:', error);
      throw error;
    }
  }

  // POST Send Reaction
  async sendReaction(phone: string, messageId: string, emoji: string): Promise<EvolutionApiResponse> {
    console.log('Enviando reação via Evolution API:', { phone, messageId, emoji });
    
    try {
      const payload = {
        reactionMessage: {
          key: {
            id: messageId,
            remoteJid: phone.replace(/\D/g, '') + '@s.whatsapp.net',
            fromMe: false,
          },
          reaction: emoji,
        },
      };

      const response = await fetch(this.getUrl('message/sendReaction'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Resposta reação Evolution API:', data);
      return data;
    } catch (error) {
      console.error('Erro ao enviar reação:', error);
      throw error;
    }
  }

  // POST Send Poll
  async sendPoll(phone: string, name: string, selectableCount: number, values: string[]): Promise<EvolutionApiResponse> {
    console.log('Enviando enquete via Evolution API:', { phone, name, values });
    
    try {
      const payload = {
        number: phone.replace(/\D/g, ''),
        pollMessage: {
          name,
          selectableCount,
          values,
        },
      };

      const response = await fetch(this.getUrl('message/sendPoll'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Resposta enquete Evolution API:', data);
      return data;
    } catch (error) {
      console.error('Erro ao enviar enquete:', error);
      throw error;
    }
  }

  // POST Check is WhatsApp
  async checkWhatsApp(phones: string[]): Promise<EvolutionApiResponse> {
    console.log('Verificando números WhatsApp:', phones);
    
    try {
      const payload = {
        numbers: phones.map(phone => phone.replace(/\D/g, '')),
      };

      const response = await fetch(this.getUrl('chat/whatsappNumbers'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Resposta verificação WhatsApp:', data);
      return data;
    } catch (error) {
      console.error('Erro ao verificar números WhatsApp:', error);
      throw error;
    }
  }

  // PUT Mark Message As Read
  async markMessageAsRead(phone: string, messageIds: string[]): Promise<EvolutionApiResponse> {
    console.log('Marcando mensagens como lidas:', { phone, messageIds });
    
    try {
      const payload = {
        read_messages: messageIds.map(id => ({
          id,
          fromMe: false,
          remoteJid: phone.replace(/\D/g, '') + '@s.whatsapp.net',
        })),
      };

      const response = await fetch(this.getUrl('chat/markMessageAsRead'), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Mensagens marcadas como lidas:', data);
      return data;
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas:', error);
      throw error;
    }
  }

  // PUT Archive Chat
  async archiveChat(phone: string, archive: boolean = true): Promise<EvolutionApiResponse> {
    console.log('Arquivando chat:', { phone, archive });
    
    try {
      const payload = {
        lastMessage: {
          key: {
            remoteJid: phone.replace(/\D/g, '') + '@s.whatsapp.net',
          },
        },
        archive,
      };

      const response = await fetch(this.getUrl('chat/archiveChat'), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Chat arquivado:', data);
      return data;
    } catch (error) {
      console.error('Erro ao arquivar chat:', error);
      throw error;
    }
  }

  // DEL Delete Message for Everyone
  async deleteMessageForEveryone(phone: string, messageId: string): Promise<EvolutionApiResponse> {
    console.log('Deletando mensagem para todos:', { phone, messageId });
    
    try {
      const payload = {
        key: {
          id: messageId,
          remoteJid: phone.replace(/\D/g, '') + '@s.whatsapp.net',
          fromMe: true,
        },
      };

      const response = await fetch(this.getUrl('chat/deleteMessage'), {
        method: 'DELETE',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Mensagem deletada para todos:', data);
      return data;
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error);
      throw error;
    }
  }

  // POST Send Presence
  async sendPresence(phone: string, presence: 'unavailable' | 'available' | 'composing' | 'recording'): Promise<EvolutionApiResponse> {
    console.log('Enviando presença:', { phone, presence });
    
    try {
      const payload = {
        number: phone.replace(/\D/g, ''),
        presence,
      };

      const response = await fetch(this.getUrl('chat/sendPresence'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Presença enviada:', data);
      return data;
    } catch (error) {
      console.error('Erro ao enviar presença:', error);
      throw error;
    }
  }

  // POST Fetch Profile Picture URL
  async fetchProfilePictureUrl(phone: string): Promise<EvolutionApiResponse> {
    console.log('Buscando foto de perfil:', phone);
    
    try {
      const payload = {
        number: phone.replace(/\D/g, ''),
      };

      const response = await fetch(this.getUrl('chat/fetchProfilePictureUrl'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Foto de perfil encontrada:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar foto de perfil:', error);
      throw error;
    }
  }

  // POST Find Contacts
  async findContacts(): Promise<EvolutionApiResponse> {
    console.log('Buscando contatos da instância');
    
    try {
      const response = await fetch(this.getUrl('chat/findContacts'), {
        method: 'POST',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      console.log('Contatos encontrados:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      throw error;
    }
  }

  // POST Find Messages
  async findMessages(phone: string, limit?: number): Promise<EvolutionApiResponse> {
    console.log('Buscando mensagens:', { phone, limit });
    
    try {
      const payload = {
        remoteJid: phone.replace(/\D/g, '') + '@s.whatsapp.net',
        limit: limit || 50,
      };

      const response = await fetch(this.getUrl('chat/findMessages'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Mensagens encontradas:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      throw error;
    }
  }

  // POST Find Status Message
  async findStatusMessage(): Promise<EvolutionApiResponse> {
    console.log('Buscando mensagens de status');
    
    try {
      const response = await fetch(this.getUrl('chat/findStatusMessage'), {
        method: 'POST',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      console.log('Status encontrados:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar status:', error);
      throw error;
    }
  }

  // PUT Update Message
  async updateMessage(phone: string, messageId: string, text: string): Promise<EvolutionApiResponse> {
    console.log('Atualizando mensagem:', { phone, messageId, text });
    
    try {
      const payload = {
        number: phone.replace(/\D/g, ''),
        key: {
          id: messageId,
          remoteJid: phone.replace(/\D/g, '') + '@s.whatsapp.net',
          fromMe: true,
        },
        text,
      };

      const response = await fetch(this.getUrl('chat/updateMessage'), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Mensagem atualizada:', data);
      return data;
    } catch (error) {
      console.error('Erro ao atualizar mensagem:', error);
      throw error;
    }
  }

  // GET Find Chats
  async findChats(): Promise<EvolutionApiResponse> {
    console.log('Buscando chats da instância');
    
    try {
      const response = await fetch(this.getUrl('chat/findChats'), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      console.log('Chats encontrados:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
      throw error;
    }
  }

  // POST Fetch Business Profile
  async fetchBusinessProfile(phone: string): Promise<EvolutionApiResponse> {
    console.log('Buscando perfil comercial:', phone);
    
    try {
      const payload = {
        number: phone.replace(/\D/g, ''),
      };

      const response = await fetch(this.getUrl('profile/fetchBusinessProfile'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Perfil comercial encontrado:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar perfil comercial:', error);
      throw error;
    }
  }

  // POST Fetch Profile
  async fetchProfile(phone: string): Promise<EvolutionApiResponse> {
    console.log('Buscando perfil:', phone);
    
    try {
      const payload = {
        number: phone.replace(/\D/g, ''),
      };

      const response = await fetch(this.getUrl('profile/fetchProfile'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Perfil encontrado:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
  }

  // POST Update Profile Name
  async updateProfileName(name: string): Promise<EvolutionApiResponse> {
    console.log('Atualizando nome do perfil:', name);
    
    try {
      const payload = {
        name,
      };

      const response = await fetch(this.getUrl('profile/updateProfileName'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Nome do perfil atualizado:', data);
      return data;
    } catch (error) {
      console.error('Erro ao atualizar nome do perfil:', error);
      throw error;
    }
  }

  // POST Update Profile Status
  async updateProfileStatus(status: string): Promise<EvolutionApiResponse> {
    console.log('Atualizando status do perfil:', status);
    
    try {
      const payload = {
        status,
      };

      const response = await fetch(this.getUrl('profile/updateProfileStatus'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Status do perfil atualizado:', data);
      return data;
    } catch (error) {
      console.error('Erro ao atualizar status do perfil:', error);
      throw error;
    }
  }

  // PUT Update Profile Picture
  async updateProfilePicture(pictureUrl: string): Promise<EvolutionApiResponse> {
    console.log('Atualizando foto do perfil:', pictureUrl);
    
    try {
      const payload = {
        picture: pictureUrl,
      };

      const response = await fetch(this.getUrl('profile/updateProfilePicture'), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Foto do perfil atualizada:', data);
      return data;
    } catch (error) {
      console.error('Erro ao atualizar foto do perfil:', error);
      throw error;
    }
  }

  // PUT Remove Profile Picture
  async removeProfilePicture(): Promise<EvolutionApiResponse> {
    console.log('Removendo foto do perfil');
    
    try {
      const response = await fetch(this.getUrl('profile/removeProfilePicture'), {
        method: 'PUT',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      console.log('Foto do perfil removida:', data);
      return data;
    } catch (error) {
      console.error('Erro ao remover foto do perfil:', error);
      throw error;
    }
  }

  // GET Fetch Privacy Settings
  async fetchPrivacySettings(): Promise<EvolutionApiResponse> {
    console.log('Buscando configurações de privacidade');
    
    try {
      const response = await fetch(this.getUrl('profile/fetchPrivacySettings'), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      console.log('Configurações de privacidade:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar configurações de privacidade:', error);
      throw error;
    }
  }

  // PUT Update Privacy Settings
  async updatePrivacySettings(settings: {
    readreceipts?: 'all' | 'none';
    profile?: 'all' | 'contacts' | 'contact_blacklist' | 'none';
    status?: 'all' | 'contacts' | 'contact_blacklist' | 'none';
    online?: 'all' | 'match_last_seen';
    last?: 'all' | 'contacts' | 'contact_blacklist' | 'none';
    groupadd?: 'all' | 'contacts' | 'contact_blacklist' | 'none';
  }): Promise<EvolutionApiResponse> {
    console.log('Atualizando configurações de privacidade:', settings);
    
    try {
      const response = await fetch(this.getUrl('profile/updatePrivacySettings'), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      console.log('Configurações de privacidade atualizadas:', data);
      return data;
    } catch (error) {
      console.error('Erro ao atualizar configurações de privacidade:', error);
      throw error;
    }
  }

  // POST Create Group
  async createGroup(subject: string, participants: string[], description?: string): Promise<EvolutionApiResponse> {
    console.log('Criando grupo:', { subject, participants, description });
    
    try {
      const payload = {
        subject,
        description: description || '',
        participants: participants.map(phone => phone.replace(/\D/g, '') + '@s.whatsapp.net'),
      };

      const response = await fetch(this.getUrl('group/create'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Grupo criado:', data);
      return data;
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      throw error;
    }
  }

  // PUT Update Group Picture
  async updateGroupPicture(groupJid: string, pictureUrl: string): Promise<EvolutionApiResponse> {
    console.log('Atualizando foto do grupo:', { groupJid, pictureUrl });
    
    try {
      const payload = {
        groupJid,
        picture: pictureUrl,
      };

      const response = await fetch(this.getUrl('group/updateGroupPicture'), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Foto do grupo atualizada:', data);
      return data;
    } catch (error) {
      console.error('Erro ao atualizar foto do grupo:', error);
      throw error;
    }
  }

  // PUT Update Group Subject
  async updateGroupSubject(groupJid: string, subject: string): Promise<EvolutionApiResponse> {
    console.log('Atualizando título do grupo:', { groupJid, subject });
    
    try {
      const payload = {
        groupJid,
        subject,
      };

      const response = await fetch(this.getUrl('group/updateGroupSubject'), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Título do grupo atualizado:', data);
      return data;
    } catch (error) {
      console.error('Erro ao atualizar título do grupo:', error);
      throw error;
    }
  }

  // PUT Update Group Description
  async updateGroupDescription(groupJid: string, description: string): Promise<EvolutionApiResponse> {
    console.log('Atualizando descrição do grupo:', { groupJid, description });
    
    try {
      const payload = {
        groupJid,
        description,
      };

      const response = await fetch(this.getUrl('group/updateGroupDescription'), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Descrição do grupo atualizada:', data);
      return data;
    } catch (error) {
      console.error('Erro ao atualizar descrição do grupo:', error);
      throw error;
    }
  }

  // GET Fetch Invite Code
  async fetchInviteCode(groupJid: string): Promise<EvolutionApiResponse> {
    console.log('Buscando código de convite do grupo:', groupJid);
    
    try {
      const payload = {
        groupJid,
      };

      const response = await fetch(this.getUrl('group/fetchInviteCode'), {
        method: 'GET',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Código de convite encontrado:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar código de convite:', error);
      throw error;
    }
  }

  // GET Accept Invite Code
  async acceptInviteCode(inviteCode: string): Promise<EvolutionApiResponse> {
    console.log('Aceitando convite do grupo:', inviteCode);
    
    try {
      const payload = {
        inviteCode,
      };

      const response = await fetch(this.getUrl('group/acceptInviteCode'), {
        method: 'GET',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Convite aceito:', data);
      return data;
    } catch (error) {
      console.error('Erro ao aceitar convite:', error);
      throw error;
    }
  }

  // PUT Revoke Invite Code
  async revokeInviteCode(groupJid: string): Promise<EvolutionApiResponse> {
    console.log('Revogando código de convite do grupo:', groupJid);
    
    try {
      const payload = {
        groupJid,
      };

      const response = await fetch(this.getUrl('group/revokeInviteCode'), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Código de convite revogado:', data);
      return data;
    } catch (error) {
      console.error('Erro ao revogar código de convite:', error);
      throw error;
    }
  }

  // POST Send Group Invite
  async sendGroupInvite(groupJid: string, phoneNumbers: string[], inviteCode: string, inviteExpiration?: number): Promise<EvolutionApiResponse> {
    console.log('Enviando convite do grupo:', { groupJid, phoneNumbers, inviteCode });
    
    try {
      const payload = {
        groupJid,
        phoneNumbers: phoneNumbers.map(phone => phone.replace(/\D/g, '')),
        inviteCode,
        inviteExpiration: inviteExpiration || 604800, // 7 dias por padrão
      };

      const response = await fetch(this.getUrl('group/sendInvite'), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Convites enviados:', data);
      return data;
    } catch (error) {
      console.error('Erro ao enviar convites:', error);
      throw error;
    }
  }

  // GET Find Group by Invite Code
  async findGroupByInviteCode(inviteCode: string): Promise<EvolutionApiResponse> {
    console.log('Buscando grupo por código de convite:', inviteCode);
    
    try {
      const payload = {
        inviteCode,
      };

      const response = await fetch(this.getUrl('group/findGroupByInviteCode'), {
        method: 'GET',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Grupo encontrado por convite:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar grupo por convite:', error);
      throw error;
    }
  }

  // GET Find Group by JID
  async findGroupByJid(groupJid: string): Promise<EvolutionApiResponse> {
    console.log('Buscando grupo por JID:', groupJid);
    
    try {
      const payload = {
        groupJid,
      };

      const response = await fetch(this.getUrl('group/findGroup'), {
        method: 'GET',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Grupo encontrado por JID:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar grupo por JID:', error);
      throw error;
    }
  }

  // GET Fetch All Groups
  async fetchAllGroups(): Promise<EvolutionApiResponse> {
    console.log('Buscando todos os grupos');
    
    try {
      const response = await fetch(this.getUrl('group/fetchAllGroups'), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      console.log('Todos os grupos encontrados:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar todos os grupos:', error);
      throw error;
    }
  }

  // GET Find Group Members
  async findGroupMembers(groupJid: string): Promise<EvolutionApiResponse> {
    console.log('Buscando membros do grupo:', groupJid);
    
    try {
      const payload = {
        groupJid,
      };

      const response = await fetch(this.getUrl('group/findGroupMembers'), {
        method: 'GET',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Membros do grupo encontrados:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar membros do grupo:', error);
      throw error;
    }
  }

  // PUT Update Group Members
  async updateGroupMembers(groupJid: string, action: 'add' | 'remove' | 'promote' | 'demote', participants: string[]): Promise<EvolutionApiResponse> {
    console.log('Atualizando membros do grupo:', { groupJid, action, participants });
    
    try {
      const payload = {
        groupJid,
        action,
        participants: participants.map(phone => phone.replace(/\D/g, '') + '@s.whatsapp.net'),
      };

      const response = await fetch(this.getUrl('group/updateGroupMembers'), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Membros do grupo atualizados:', data);
      return data;
    } catch (error) {
      console.error('Erro ao atualizar membros do grupo:', error);
      throw error;
    }
  }

  // PUT Update Group Setting
  async updateGroupSetting(groupJid: string, action: 'announcement' | 'not_announcement' | 'locked' | 'unlocked'): Promise<EvolutionApiResponse> {
    console.log('Atualizando configuração do grupo:', { groupJid, action });
    
    try {
      const payload = {
        groupJid,
        action,
      };

      const response = await fetch(this.getUrl('group/updateSetting'), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Configuração do grupo atualizada:', data);
      return data;
    } catch (error) {
      console.error('Erro ao atualizar configuração do grupo:', error);
      throw error;
    }
  }

  // PUT Toggle Ephemeral
  async toggleEphemeral(groupJid: string, expiration: number): Promise<EvolutionApiResponse> {
    console.log('Alternando mensagens temporárias do grupo:', { groupJid, expiration });
    
    try {
      const payload = {
        groupJid,
        expiration, // 0 para desabilitar, outros valores para habilitar (em segundos)
      };

      const response = await fetch(this.getUrl('group/toggleEphemeral'), {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Mensagens temporárias alteradas:', data);
      return data;
    } catch (error) {
      console.error('Erro ao alterar mensagens temporárias:', error);
      throw error;
    }
  }

  // DEL Leave Group
  async leaveGroup(groupJid: string): Promise<EvolutionApiResponse> {
    console.log('Saindo do grupo:', groupJid);
    
    try {
      const payload = {
        groupJid,
      };

      const response = await fetch(this.getUrl('group/leaveGroup'), {
        method: 'DELETE',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Saiu do grupo:', data);
      return data;
    } catch (error) {
      console.error('Erro ao sair do grupo:', error);
      throw error;
    }
  }
}

export { EvolutionApiService, EvolutionApiGlobalService };