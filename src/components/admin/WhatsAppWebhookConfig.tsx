import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useWhatsAppConnections } from '@/hooks/useWhatsAppConnections';
import { Loader2, Edit, Webhook } from 'lucide-react';

interface WhatsAppWebhookConfigProps {
  connectionId: string;
  currentWebhookUrl?: string;
  onUpdate?: () => void;
}

export function WhatsAppWebhookConfig({ connectionId, currentWebhookUrl, onUpdate }: WhatsAppWebhookConfigProps) {
  const [open, setOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(currentWebhookUrl || '');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { updateConnection } = useWhatsAppConnections();

  const handleSave = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "URL obrigatória",
        description: "Por favor, insira uma URL válida para o webhook.",
        variant: "destructive",
      });
      return;
    }

    // Validar se é uma URL válida
    try {
      new URL(webhookUrl);
    } catch {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida (ex: https://exemplo.com/webhook).",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const success = await updateConnection(connectionId, {
        send_webhook_url: webhookUrl
      });

      if (success) {
        toast({
          title: "Webhook configurado",
          description: "URL do webhook foi salva com sucesso.",
        });
        setOpen(false);
        onUpdate?.();
      } else {
        throw new Error('Falha ao atualizar conexão');
      }
    } catch (error) {
      console.error('Erro ao salvar webhook:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a URL do webhook. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Webhook className="h-4 w-4 mr-2" />
          {currentWebhookUrl ? 'Editar Webhook' : 'Configurar Webhook'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configurar Webhook de Envio</DialogTitle>
          <DialogDescription>
            Configure a URL do webhook que será usada para enviar mensagens através desta conexão WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL do Webhook</Label>
            <Input
              id="webhook-url"
              placeholder="https://api.exemplo.com/webhook/send"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              Esta URL será usada para enviar mensagens do WhatsApp através das automações.
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function WhatsAppConnectionWebhookCard({ connection }: { connection: any }) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Webhook de Envio</span>
          <WhatsAppWebhookConfig
            connectionId={connection.id}
            currentWebhookUrl={connection.send_webhook_url}
            onUpdate={() => setRefreshKey(prev => prev + 1)}
          />
        </CardTitle>
        <CardDescription>
          Configure a URL do webhook para envio de mensagens através desta conexão.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {connection.send_webhook_url ? (
          <div className="space-y-2">
            <Label>URL Configurada:</Label>
            <div className="p-3 bg-muted rounded-md break-all text-sm">
              {connection.send_webhook_url}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Nenhuma URL de webhook configurada. Configure uma URL para habilitar o envio de mensagens.
          </p>
        )}
      </CardContent>
    </Card>
  );
}