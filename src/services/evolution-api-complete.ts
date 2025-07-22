import { logger } from '@/utils/logger';

// Interfaces para tipos de dados da Evolution API
export interface EvolutionAPIResponse<T = any> {
  status: number;
  data?: T;
  message?: string;
  error?: string;
}

export interface InstanceInfo {
  instanceName: string;
  status: string;
  qrcode?: string;
  number?: string;
}

export interface MessageOptions {
  number: string;
  text?: string;
  delay?: number;
  linkPreview?: boolean;
}

export interface MediaMessage {
  number: string;
  media: string;
  caption?: string;
  filename?: string;
}

export interface ContactMessage {
  number: string;
  contact: {
    name: string;
    phone: string;
  };
}

export interface LocationMessage {
  number: string;
  latitude: number;
  longitude: number;
  name?: string;
}

export interface ListMessage {
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
}

export interface PollMessage {
  number: string;
  question: string;
  options: string[];
  multipleSelect?: boolean;
}

export interface WebhookConfig {
  url: string;
  events: string[];
  webhook_by_events?: boolean;
}

export interface InstanceSettings {
  rejectCalls?: boolean;
  msgCall?: string;
  groupsIgnore?: boolean;
  alwaysOnline?: boolean;
  readMessages?: boolean;
  readStatus?: boolean;
}

export interface GroupInfo {
  subject: string;
  participants: string[];
  description?: string;
}

export interface ProfileSettings {
  name?: string;
  status?: string;
  pictureUrl?: string;
}

export interface PrivacySettings {
  lastSeen?: 'all' | 'contacts' | 'nobody';
  profilePicture?: 'all' | 'contacts' | 'nobody';
  status?: 'all' | 'contacts' | 'nobody';
  readReceipts?: 'all' | 'nobody';
  groups?: 'all' | 'contacts' | 'nobody';
}

export interface ChatwootConfig {
  url: string;
  accountId: string;
  token: string;
  sign_msg?: boolean;
  reopen_conversation?: boolean;
  conversation_pending?: boolean;
}

export interface TypebotConfig {
  url: string;
  typebot: string;
  expire?: number;
  keyword_finish?: string;
  delay_message?: number;
  unknown_message?: string;
  listening_from_me?: boolean;
}

export interface SQSConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  queueUrl: string;
}

export interface RabbitMQConfig {
  url: string;
  exchange: string;
  routingKey?: string;
}

/**
 * Serviço completo para Evolution API v2
 * Implementa todas as funcionalidades da documentação oficial
 */
export class EvolutionAPIService {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = apiKey;
  }

  private async makeRequest<T = any>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<EvolutionAPIResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const options: RequestInit = {
        method,
        headers: {
          'apikey': this.apiKey,
          'Content-Type': 'application/json',
        },
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      logger.info('Evolution API Request', {
        component: 'EvolutionAPIService',
        metadata: { url, method, endpoint }
      });
      
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return {
        status: response.status,
        data,
        message: data.message
      };
    } catch (error) {
      logger.error('Evolution API Error', {
        component: 'EvolutionAPIService',
        metadata: { endpoint, method }
      }, error as Error);
      return {
        status: 500,
        error: (error as Error).message
      };
    }
  }

  // ===== INFORMAÇÕES GERAIS =====
  async getInfo() {
    return this.makeRequest('/');
  }

  // ===== GERENCIAMENTO DE INSTÂNCIAS =====
  async createInstance(data: {
    instanceName: string;
    token?: string;
    qrcode?: boolean;
    number?: string;
    integration?: string;
    webhook?: string;
    webhook_by_events?: boolean;
    events?: string[];
    reject_call?: boolean;
    msg_call?: string;
    groups_ignore?: boolean;
    always_online?: boolean;
    read_messages?: boolean;
    read_status?: boolean;
    websocket_enabled?: boolean;
    websocket_events?: string[];
    rabbitmq_enabled?: boolean;
    rabbitmq_events?: string[];
    sqs_enabled?: boolean;
    sqs_events?: string[];
    typebot_url?: string;
    typebot?: string;
    typebot_expire?: number;
    typebot_keyword_finish?: string;
    typebot_delay_message?: number;
    typebot_unknown_message?: string;
    typebot_listening_from_me?: boolean;
    chatwoot_account_id?: number;
    chatwoot_token?: string;
    chatwoot_url?: string;
    chatwoot_sign_msg?: boolean;
    chatwoot_reopen_conversation?: boolean;
    chatwoot_conversation_pending?: boolean;
  }) {
    return this.makeRequest('/instance/create', 'POST', data);
  }

  async fetchInstances() {
    return this.makeRequest<InstanceInfo[]>('/instance/fetchInstances');
  }

  async connectInstance(instanceName: string) {
    return this.makeRequest(`/instance/connect/${instanceName}`);
  }

  async restartInstance(instanceName: string) {
    return this.makeRequest(`/instance/restart/${instanceName}`, 'PUT');
  }

  async getConnectionState(instanceName: string) {
    return this.makeRequest(`/instance/connectionState/${instanceName}`);
  }

  async logoutInstance(instanceName: string) {
    return this.makeRequest(`/instance/logout/${instanceName}`, 'DELETE');
  }

  async deleteInstance(instanceName: string) {
    return this.makeRequest(`/instance/delete/${instanceName}`, 'DELETE');
  }

  async setPresence(instanceName: string, presence: 'online' | 'offline') {
    return this.makeRequest(`/instance/setPresence/${instanceName}`, 'POST', { presence });
  }

  // ===== WEBHOOK =====
  async setWebhook(instanceName: string, config: WebhookConfig) {
    return this.makeRequest(`/webhook/set/${instanceName}`, 'POST', config);
  }

  async findWebhook(instanceName: string) {
    return this.makeRequest(`/webhook/find/${instanceName}`);
  }

  // ===== CONFIGURAÇÕES =====
  async setSettings(instanceName: string, settings: InstanceSettings) {
    return this.makeRequest(`/settings/set/${instanceName}`, 'POST', settings);
  }

  async findSettings(instanceName: string) {
    return this.makeRequest(`/settings/find/${instanceName}`);
  }

  // ===== ENVIO DE MENSAGENS =====
  async sendTemplate(instanceName: string, data: {
    number: string;
    templateName: string;
    parameters: string[];
    language?: string;
  }) {
    return this.makeRequest(`/message/sendTemplate/${instanceName}`, 'POST', data);
  }

  async sendText(instanceName: string, data: MessageOptions) {
    return this.makeRequest(`/message/sendText/${instanceName}`, 'POST', data);
  }

  async sendStatus(instanceName: string, data: {
    text?: string;
    backgroundColor?: string;
    media?: string;
    caption?: string;
  }) {
    return this.makeRequest(`/message/sendStatus/${instanceName}`, 'POST', data);
  }

  async sendMedia(instanceName: string, data: MediaMessage) {
    return this.makeRequest(`/message/sendMedia/${instanceName}`, 'POST', data);
  }

  async sendAudio(instanceName: string, data: {
    number: string;
    audio: string;
    caption?: string;
  }) {
    return this.makeRequest(`/message/sendWhatsAppAudio/${instanceName}`, 'POST', data);
  }

  async sendSticker(instanceName: string, data: {
    number: string;
    sticker: string;
  }) {
    return this.makeRequest(`/message/sendSticker/${instanceName}`, 'POST', data);
  }

  async sendLocation(instanceName: string, data: LocationMessage) {
    return this.makeRequest(`/message/sendLocation/${instanceName}`, 'POST', data);
  }

  async sendContact(instanceName: string, data: ContactMessage) {
    return this.makeRequest(`/message/sendContact/${instanceName}`, 'POST', data);
  }

  async sendReaction(instanceName: string, data: {
    messageId: string;
    reaction: string;
  }) {
    return this.makeRequest(`/message/sendReaction/${instanceName}`, 'POST', data);
  }

  async sendPoll(instanceName: string, data: PollMessage) {
    return this.makeRequest(`/message/sendPoll/${instanceName}`, 'POST', data);
  }

  async sendList(instanceName: string, data: ListMessage) {
    return this.makeRequest(`/message/sendList/${instanceName}`, 'POST', data);
  }

  // ===== CONTROLE DE CHAT =====
  async checkIsWhatsApp(instanceName: string, number: string) {
    return this.makeRequest(`/chat/checkIsWhatsApp/${instanceName}`, 'POST', { number });
  }

  async markMessageAsRead(instanceName: string, messageId: string) {
    return this.makeRequest(`/chat/markMessageAsRead/${instanceName}`, 'PUT', { messageId });
  }

  async archiveChat(instanceName: string, chatId: string) {
    return this.makeRequest(`/chat/archiveChat/${instanceName}`, 'PUT', { chatId });
  }

  async deleteMessage(instanceName: string, messageId: string) {
    return this.makeRequest(`/chat/deleteMessage/${instanceName}`, 'DELETE', { messageId });
  }

  async sendPresence(instanceName: string, data: {
    chatId: string;
    presence: 'typing' | 'recording' | 'paused';
  }) {
    return this.makeRequest(`/chat/sendPresence/${instanceName}`, 'POST', data);
  }

  async fetchProfilePictureUrl(instanceName: string, number: string) {
    return this.makeRequest(`/chat/fetchProfilePictureUrl/${instanceName}`, 'POST', { number });
  }

  async findContacts(instanceName: string) {
    return this.makeRequest(`/chat/findContacts/${instanceName}`, 'POST', {});
  }

  async findMessages(instanceName: string, data: {
    chatId: string;
    limit?: number;
    offset?: number;
  }) {
    return this.makeRequest(`/chat/findMessages/${instanceName}`, 'POST', data);
  }

  async findStatusMessage(instanceName: string) {
    return this.makeRequest(`/chat/findStatusMessage/${instanceName}`, 'POST', {});
  }

  async updateMessage(instanceName: string, data: {
    messageId: string;
    text: string;
  }) {
    return this.makeRequest(`/chat/updateMessage/${instanceName}`, 'PUT', data);
  }

  async findChats(instanceName: string) {
    return this.makeRequest(`/chat/findChats/${instanceName}`);
  }

  // ===== CONFIGURAÇÕES DE PERFIL =====
  async fetchBusinessProfile(instanceName: string) {
    return this.makeRequest(`/profile/fetchBusinessProfile/${instanceName}`, 'POST', {});
  }

  async fetchProfile(instanceName: string) {
    return this.makeRequest(`/profile/fetchProfile/${instanceName}`, 'POST', {});
  }

  async updateProfileName(instanceName: string, name: string) {
    return this.makeRequest(`/profile/updateProfileName/${instanceName}`, 'POST', { name });
  }

  async updateProfileStatus(instanceName: string, status: string) {
    return this.makeRequest(`/profile/updateProfileStatus/${instanceName}`, 'POST', { status });
  }

  async updateProfilePicture(instanceName: string, url: string) {
    return this.makeRequest(`/profile/updateProfilePicture/${instanceName}`, 'PUT', { url });
  }

  async removeProfilePicture(instanceName: string) {
    return this.makeRequest(`/profile/removeProfilePicture/${instanceName}`, 'PUT');
  }

  async fetchPrivacySettings(instanceName: string) {
    return this.makeRequest(`/profile/fetchPrivacySettings/${instanceName}`);
  }

  async updatePrivacySettings(instanceName: string, settings: PrivacySettings) {
    return this.makeRequest(`/profile/updatePrivacySettings/${instanceName}`, 'PUT', settings);
  }

  // ===== CONTROLE DE GRUPOS =====
  async createGroup(instanceName: string, data: GroupInfo) {
    return this.makeRequest(`/group/createGroup/${instanceName}`, 'POST', data);
  }

  async updateGroupPicture(instanceName: string, data: { groupId: string; url: string }) {
    return this.makeRequest(`/group/updateGroupPicture/${instanceName}`, 'PUT', data);
  }

  async updateGroupSubject(instanceName: string, data: { groupId: string; subject: string }) {
    return this.makeRequest(`/group/updateGroupSubject/${instanceName}`, 'PUT', data);
  }

  async updateGroupDescription(instanceName: string, data: { groupId: string; description: string }) {
    return this.makeRequest(`/group/updateGroupDescription/${instanceName}`, 'PUT', data);
  }

  async fetchInviteCode(instanceName: string, groupId: string) {
    return this.makeRequest(`/group/fetchInviteCode/${instanceName}?groupId=${groupId}`);
  }

  async acceptInviteCode(instanceName: string, inviteCode: string) {
    return this.makeRequest(`/group/acceptInviteCode/${instanceName}?inviteCode=${inviteCode}`);
  }

  async revokeInviteCode(instanceName: string, groupId: string) {
    return this.makeRequest(`/group/revokeInviteCode/${instanceName}`, 'PUT', { groupId });
  }

  async sendGroupInvite(instanceName: string, data: { groupId: string; number: string }) {
    return this.makeRequest(`/group/sendGroupInvite/${instanceName}`, 'POST', data);
  }

  async findGroupByInviteCode(instanceName: string, inviteCode: string) {
    return this.makeRequest(`/group/findGroupByInviteCode/${instanceName}?inviteCode=${inviteCode}`);
  }

  async findGroupByJid(instanceName: string, groupId: string) {
    return this.makeRequest(`/group/findGroupByJid/${instanceName}?groupId=${groupId}`);
  }

  async fetchAllGroups(instanceName: string) {
    return this.makeRequest(`/group/fetchAllGroups/${instanceName}`);
  }

  async findGroupMembers(instanceName: string, groupId: string) {
    return this.makeRequest(`/group/findGroupMembers/${instanceName}?groupId=${groupId}`);
  }

  async updateGroupMembers(instanceName: string, data: {
    groupId: string;
    participants: string[];
    action: 'add' | 'remove' | 'promote' | 'demote';
  }) {
    return this.makeRequest(`/group/updateGroupMembers/${instanceName}`, 'PUT', data);
  }

  async updateGroupSetting(instanceName: string, data: {
    groupId: string;
    setting: 'sendMessages' | 'editInfo';
    value: 'all' | 'admins';
  }) {
    return this.makeRequest(`/group/updateGroupSetting/${instanceName}`, 'PUT', data);
  }

  async toggleEphemeral(instanceName: string, data: {
    groupId: string;
    enabled: boolean;
    duration?: number;
  }) {
    return this.makeRequest(`/group/toggleEphemeral/${instanceName}`, 'PUT', data);
  }

  async leaveGroup(instanceName: string, groupId: string) {
    return this.makeRequest(`/group/leaveGroup/${instanceName}`, 'DELETE', { groupId });
  }

  // ===== TYPEBOT =====
  async setTypebot(instanceName: string, config: TypebotConfig) {
    return this.makeRequest(`/typebot/set/${instanceName}`, 'POST', config);
  }

  async startTypebot(instanceName: string, data: { number: string; flowId: string }) {
    return this.makeRequest(`/typebot/start/${instanceName}`, 'POST', data);
  }

  async findTypebot(instanceName: string) {
    return this.makeRequest(`/typebot/find/${instanceName}`);
  }

  async changeTypebotStatus(instanceName: string, enabled: boolean) {
    return this.makeRequest(`/typebot/changeStatus/${instanceName}`, 'POST', { enabled });
  }

  // ===== CHATWOOT =====
  async setChatwoot(instanceName: string, config: ChatwootConfig) {
    return this.makeRequest(`/chatwoot/set/${instanceName}`, 'POST', config);
  }

  async findChatwoot(instanceName: string) {
    return this.makeRequest(`/chatwoot/find/${instanceName}`);
  }

  // ===== SQS =====
  async setSQS(instanceName: string, config: SQSConfig) {
    return this.makeRequest(`/sqs/set/${instanceName}`, 'POST', config);
  }

  async findSQS(instanceName: string) {
    return this.makeRequest(`/sqs/find/${instanceName}`);
  }

  // ===== RABBITMQ =====
  async setRabbitMQ(instanceName: string, config: RabbitMQConfig) {
    return this.makeRequest(`/rabbitmq/set/${instanceName}`, 'POST', config);
  }

  async findRabbitMQ(instanceName: string) {
    return this.makeRequest(`/rabbitmq/find/${instanceName}`);
  }

  // ===== WEBSOCKET =====
  async findWebSocketChatwoot(instanceName: string) {
    return this.makeRequest(`/websocket/findChatwoot/${instanceName}`);
  }

  async setWebSocketChatwoot(instanceName: string, url: string) {
    return this.makeRequest(`/websocket/setChatwoot/${instanceName}`, 'POST', { url });
  }
}

export default EvolutionAPIService;