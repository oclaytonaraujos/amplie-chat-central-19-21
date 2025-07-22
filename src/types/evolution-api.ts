// Evolution API Types
export interface EvolutionApiConfig {
  apiKey: string;
  serverUrl: string;
  instanceName: string;
  webhookUrl?: string;
  webhookEvents?: string[];
}

export interface EvolutionApiMessage {
  number: string;
  text: string;
  delay?: number;
  linkPreview?: boolean;
  mentionsEveryOne?: boolean;
  mentioned?: string[];
  quoted?: {
    key: {
      id: string;
    };
    message: {
      conversation: string;
    };
  };
}

export interface EvolutionApiMediaMessage {
  number: string;
  mediatype: 'image' | 'document' | 'audio' | 'video';
  media: string; // URL or base64
  caption?: string;
  fileName?: string;
  delay?: number;
}

export interface EvolutionApiButtonMessage {
  number: string;
  buttonMessage: {
    text: string;
    buttons: Array<{
      id: string;
      text: string;
    }>;
    footer?: string;
  };
}

export interface EvolutionApiListMessage {
  number: string;
  listMessage: {
    title: string;
    description: string;
    buttonText: string;
    footerText?: string;
    sections: Array<{
      title: string;
      rows: Array<{
        id: string;
        title: string;
        description?: string;
      }>;
    }>;
  };
}

export interface EvolutionApiWebhookMessage {
  event: string;
  instance: string;
  data: {
    key: {
      remoteJid: string;
      fromMe: boolean;
      id: string;
    };
    pushName?: string;
    message?: {
      conversation?: string;
      extendedTextMessage?: {
        text: string;
      };
      imageMessage?: {
        url: string;
        mimetype: string;
        caption?: string;
      };
      documentMessage?: {
        url: string;
        mimetype: string;
        title: string;
        fileName: string;
      };
      audioMessage?: {
        url: string;
        mimetype: string;
      };
      videoMessage?: {
        url: string;
        mimetype: string;
        caption?: string;
      };
      contactMessage?: {
        displayName: string;
        vcard: string;
      };
      locationMessage?: {
        degreesLatitude: number;
        degreesLongitude: number;
        name?: string;
        address?: string;
      };
      buttonsResponseMessage?: {
        selectedButtonId: string;
        selectedDisplayText: string;
      };
      listResponseMessage?: {
        singleSelectReply: {
          selectedRowId: string;
        };
      };
    };
    messageTimestamp: number;
    status?: string;
  };
}

export interface EvolutionApiStatus {
  connected: boolean;
  instanceStatus: string;
  lastCheck: Date | null;
}

export interface ProcessedMessage {
  id: string;
  phone: string;
  fromMe: boolean;
  timestamp: Date;
  senderName: string;
  senderPhoto?: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'contact' | 'location' | 'button_response' | 'list_response';
  content: string;
  attachment?: {
    type: 'image' | 'document' | 'audio' | 'video';
    url: string;
    fileName?: string;
    mimeType?: string;
  };
  buttonResponse?: {
    selectedButtonId: string;
    selectedDisplayText: string;
  };
  listResponse?: {
    selectedRowId: string;
  };
}

export interface EvolutionApiInstance {
  instanceName: string;
  status: 'connected' | 'connecting' | 'disconnected' | 'qr' | 'close';
  serverUrl: string;
  apikey: string;
  qrcode?: string;
}

export interface EvolutionApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
  instance?: any;
  qrcode?: string;
  key?: any;
  webhook?: any;
}