import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useServiceWorker } from '@/hooks/useServiceWorker';

interface PushNotificationPermission {
  permission: NotificationPermission;
  supported: boolean;
}

export function PushNotifications() {
  const [notificationPermission, setNotificationPermission] = useState<PushNotificationPermission>({
    permission: 'default',
    supported: 'Notification' in window
  });
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const { isRegistered } = useServiceWorker();
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(prev => ({
        ...prev,
        permission: Notification.permission
      }));
    }

    // Verificar se já tem subscription
    if (isRegistered && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(sub => {
          setSubscription(sub);
        });
      });
    }
  }, [isRegistered]);

  const requestPermission = async () => {
    if (!notificationPermission.supported) {
      toast({
        title: "Não suportado",
        description: "Seu navegador não suporta notificações push",
        variant: "destructive"
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(prev => ({ ...prev, permission }));

      if (permission === 'granted') {
        toast({
          title: "Permissão concedida",
          description: "Você receberá notificações de novas mensagens",
          variant: "default"
        });
        await subscribeToPush();
      } else {
        toast({
          title: "Permissão negada",
          description: "Você não receberá notificações push",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      toast({
        title: "Erro",
        description: "Erro ao solicitar permissão para notificações",
        variant: "destructive"
      });
    }
  };

  const subscribeToPush = async () => {
    if (!isRegistered || !('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // VAPID key pública (em produção, mover para env)
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI0DLKUTSh9VoZOdIR1KHfqIYWFrB8Gd9BUkXfgZKJx2E-Zf_FgAv6gNH8';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      setSubscription(subscription);

      // Enviar subscription para o backend
      await saveSubscription(subscription);

      toast({
        title: "Inscrito com sucesso",
        description: "Você receberá notificações push",
        variant: "default"
      });
    } catch (error) {
      console.error('Erro ao se inscrever:', error);
      toast({
        title: "Erro na inscrição",
        description: "Erro ao se inscrever para notificações push",
        variant: "destructive"
      });
    }
  };

  const unsubscribeFromPush = async () => {
    if (!subscription) return;

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      
      // Remover subscription do backend
      await removeSubscription(subscription);

      toast({
        title: "Desinscrição realizada",
        description: "Você não receberá mais notificações push",
        variant: "default"
      });
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      toast({
        title: "Erro",
        description: "Erro ao cancelar inscrição",
        variant: "destructive"
      });
    }
  };

  const saveSubscription = async (subscription: PushSubscription) => {
    // Em produção, enviar para o backend
    const subscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
        auth: arrayBufferToBase64(subscription.getKey('auth'))
      }
    };

    // Simular salvamento local por enquanto
    localStorage.setItem('pushSubscription', JSON.stringify(subscriptionData));
    console.log('Subscription salva:', subscriptionData);
  };

  const removeSubscription = async (subscription: PushSubscription) => {
    // Em produção, remover do backend
    localStorage.removeItem('pushSubscription');
    console.log('Subscription removida');
  };

  const testNotification = async () => {
    if (notificationPermission.permission !== 'granted') {
      toast({
        title: "Permissão necessária",
        description: "Solicite permissão primeiro",
        variant: "destructive"
      });
      return;
    }

    // Notificação local de teste
    new Notification('Teste Amplie Chat', {
      body: 'Esta é uma notificação de teste',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'test-notification',
      requireInteraction: false,
      data: {
        url: '/atendimento'
      }
    });
  };

  const getStatusIcon = () => {
    switch (notificationPermission.permission) {
      case 'granted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'denied':
        return <BellOff className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (notificationPermission.permission) {
      case 'granted':
        return subscription ? 'Ativo e inscrito' : 'Permitido (inscrever-se)';
      case 'denied':
        return 'Bloqueado pelo usuário';
      default:
        return 'Não solicitado';
    }
  };

  if (!notificationPermission.supported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5 text-red-500" />
            Notificações Push
          </CardTitle>
          <CardDescription>
            Seu navegador não suporta notificações push
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificações Push
        </CardTitle>
        <CardDescription>
          Receba notificações de novas mensagens mesmo quando a aba estiver fechada
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm">Status: {getStatusText()}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {notificationPermission.permission === 'default' && (
            <Button onClick={requestPermission}>
              Permitir Notificações
            </Button>
          )}

          {notificationPermission.permission === 'granted' && !subscription && (
            <Button onClick={subscribeToPush}>
              Inscrever-se
            </Button>
          )}

          {subscription && (
            <Button variant="outline" onClick={unsubscribeFromPush}>
              Cancelar Inscrição
            </Button>
          )}

          {notificationPermission.permission === 'granted' && (
            <Button variant="secondary" onClick={testNotification}>
              Testar Notificação
            </Button>
          )}
        </div>

        {subscription && (
          <div className="text-xs text-muted-foreground">
            <p>✅ Inscrito para receber notificações push</p>
            <p>Endpoint: {subscription.endpoint.substring(0, 50)}...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Funções utilitárias
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}