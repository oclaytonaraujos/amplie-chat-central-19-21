import { useState } from 'react';
import { Bell, Mail, MessageCircle, Smartphone, Volume2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { OfflineIndicator } from '@/hooks/useServiceWorker';
export default function PreferenciasNotificacao() {
  const [emailNotifications, setEmailNotifications] = useState({
    newMessages: true,
    taskAssignments: true,
    systemUpdates: false,
    weeklyReport: true,
    securityAlerts: true,
    marketingEmails: false
  });
  const [pushNotifications, setPushNotifications] = useState({
    newMessages: true,
    mentions: true,
    reminders: true,
    systemAlerts: true,
    breaks: false
  });
  const [soundSettings, setSoundSettings] = useState({
    messageSound: true,
    notificationSound: true,
    alertSound: true,
    volume: 75
  });
  const [scheduleSettings, setScheduleSettings] = useState({
    quietHours: true,
    quietStart: '22:00',
    quietEnd: '08:00',
    weekendQuiet: false,
    vacationMode: false
  });
  const handleEmailChange = (field: string, value: boolean) => {
    setEmailNotifications(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handlePushChange = (field: string, value: boolean) => {
    setPushNotifications(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSoundChange = (field: string, value: boolean) => {
    setSoundSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleScheduleChange = (field: string, value: boolean | string) => {
    setScheduleSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSave = () => {
    console.log('Salvando preferências de notificação...');
  };
  return <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <OfflineIndicator />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Preferências de Notificação</h1>
          <p className="text-muted-foreground">Configure como e quando receber notificações</p>
        </div>
        <Button onClick={handleSave} className="bg-amplie-primary hover:bg-amplie-primary-light">
          Salvar Preferências
        </Button>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notificações por Email */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-amplie-primary" />
            Notificações por Email
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Novas Mensagens</Label>
                <p className="text-sm text-gray-500">Notificar sobre novas mensagens recebidas</p>
              </div>
              <Switch checked={emailNotifications.newMessages} onCheckedChange={checked => handleEmailChange('newMessages', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Atribuições de Tarefas</Label>
                <p className="text-sm text-gray-500">Quando uma tarefa for atribuída a você</p>
              </div>
              <Switch checked={emailNotifications.taskAssignments} onCheckedChange={checked => handleEmailChange('taskAssignments', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Atualizações do Sistema</Label>
                <p className="text-sm text-gray-500">Notificações sobre atualizações e manutenções</p>
              </div>
              <Switch checked={emailNotifications.systemUpdates} onCheckedChange={checked => handleEmailChange('systemUpdates', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Relatório Semanal</Label>
                <p className="text-sm text-gray-500">Resumo das suas atividades da semana</p>
              </div>
              <Switch checked={emailNotifications.weeklyReport} onCheckedChange={checked => handleEmailChange('weeklyReport', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Alertas de Segurança</Label>
                <p className="text-sm text-gray-500">Notificações importantes de segurança</p>
              </div>
              <Switch checked={emailNotifications.securityAlerts} onCheckedChange={checked => handleEmailChange('securityAlerts', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Emails de Marketing</Label>
                <p className="text-sm text-gray-500">Novidades, dicas e ofertas especiais</p>
              </div>
              <Switch checked={emailNotifications.marketingEmails} onCheckedChange={checked => handleEmailChange('marketingEmails', checked)} />
            </div>
          </div>
        </Card>

        {/* Notificações Push */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Smartphone className="w-5 h-5 mr-2 text-amplie-primary" />
            Notificações Push
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Novas Mensagens</Label>
                <p className="text-sm text-gray-500">Notificações instantâneas de mensagens</p>
              </div>
              <Switch checked={pushNotifications.newMessages} onCheckedChange={checked => handlePushChange('newMessages', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Menções</Label>
                <p className="text-sm text-gray-500">Quando você for mencionado em conversas</p>
              </div>
              <Switch checked={pushNotifications.mentions} onCheckedChange={checked => handlePushChange('mentions', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Lembretes</Label>
                <p className="text-sm text-gray-500">Lembretes de tarefas e compromissos</p>
              </div>
              <Switch checked={pushNotifications.reminders} onCheckedChange={checked => handlePushChange('reminders', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Alertas do Sistema</Label>
                <p className="text-sm text-gray-500">Alertas críticos do sistema</p>
              </div>
              <Switch checked={pushNotifications.systemAlerts} onCheckedChange={checked => handlePushChange('systemAlerts', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Lembretes de Pausa</Label>
                <p className="text-sm text-gray-500">Lembretes para fazer pausas</p>
              </div>
              <Switch checked={pushNotifications.breaks} onCheckedChange={checked => handlePushChange('breaks', checked)} />
            </div>
          </div>
        </Card>

        {/* Configurações de Som */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Volume2 className="w-5 h-5 mr-2 text-amplie-primary" />
            Configurações de Som
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Som de Mensagem</Label>
                <p className="text-sm text-gray-500">Reproduzir som ao receber mensagens</p>
              </div>
              <Switch checked={soundSettings.messageSound} onCheckedChange={checked => handleSoundChange('messageSound', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Som de Notificação</Label>
                <p className="text-sm text-gray-500">Som para notificações gerais</p>
              </div>
              <Switch checked={soundSettings.notificationSound} onCheckedChange={checked => handleSoundChange('notificationSound', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Som de Alerta</Label>
                <p className="text-sm text-gray-500">Som para alertas importantes</p>
              </div>
              <Switch checked={soundSettings.alertSound} onCheckedChange={checked => handleSoundChange('alertSound', checked)} />
            </div>
          </div>
        </Card>

        {/* Horários Silenciosos */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-amplie-primary" />
            Horários Silenciosos
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Ativar Horário Silencioso</Label>
                <p className="text-sm text-gray-500">Pausar notificações em horários específicos</p>
              </div>
              <Switch checked={scheduleSettings.quietHours} onCheckedChange={checked => handleScheduleChange('quietHours', checked)} />
            </div>
            {scheduleSettings.quietHours && <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quietStart">Início</Label>
                    <input id="quietStart" type="time" value={scheduleSettings.quietStart} onChange={e => handleScheduleChange('quietStart', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <Label htmlFor="quietEnd">Fim</Label>
                    <input id="quietEnd" type="time" value={scheduleSettings.quietEnd} onChange={e => handleScheduleChange('quietEnd', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                </div>
              </>}
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Silencioso nos Fins de Semana</Label>
                <p className="text-sm text-gray-500">Pausar notificações nos fins de semana</p>
              </div>
              <Switch checked={scheduleSettings.weekendQuiet} onCheckedChange={checked => handleScheduleChange('weekendQuiet', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Modo Férias</Label>
                <p className="text-sm text-gray-500">Pausar todas as notificações</p>
              </div>
              <Switch checked={scheduleSettings.vacationMode} onCheckedChange={checked => handleScheduleChange('vacationMode', checked)} />
            </div>
          </div>
        </Card>
      </div>
    </div>;
}