
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, Save, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function WebhookConfig() {
  const [n8nReceiveUrl, setN8nReceiveUrl] = useState('');
  const [n8nSendUrl, setN8nSendUrl] = useState('');
  const { toast } = useToast();

  // Carregar URLs salvas do localStorage
  useEffect(() => {
    const savedReceiveUrl = localStorage.getItem('n8n-receive-webhook-url');
    const savedSendUrl = localStorage.getItem('n8n-send-webhook-url');
    
    if (savedReceiveUrl) setN8nReceiveUrl(savedReceiveUrl);
    if (savedSendUrl) setN8nSendUrl(savedSendUrl);
  }, []);

  const handleSave = () => {
    localStorage.setItem('n8n-receive-webhook-url', n8nReceiveUrl);
    localStorage.setItem('n8n-send-webhook-url', n8nSendUrl);
    
    toast({
      title: "URLs salvas",
      description: "As URLs dos webhooks foram salvas localmente",
    });
  };

  const copyToClipboard = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${name} copiado para a área de transferência`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de Webhooks n8n</CardTitle>
        <CardDescription>
          Configure as URLs dos webhooks gerados pelo n8n
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Estas URLs serão geradas automaticamente quando você criar os workflows no n8n.
            Salve-as aqui para referência futura.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="receive-url">URL do Webhook de Recebimento</Label>
          <div className="flex gap-2">
            <Input
              id="receive-url"
              value={n8nReceiveUrl}
              onChange={(e) => setN8nReceiveUrl(e.target.value)}
              placeholder="https://seu-n8n.app.n8n.cloud/webhook/whatsapp-receive"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(n8nReceiveUrl, 'URL de Recebimento')}
              disabled={!n8nReceiveUrl}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Esta URL deve ser configurada no webhook da Evolution API
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="send-url">URL do Webhook de Envio</Label>
          <div className="flex gap-2">
            <Input
              id="send-url"
              value={n8nSendUrl}
              onChange={(e) => setN8nSendUrl(e.target.value)}
              placeholder="https://seu-n8n.app.n8n.cloud/webhook/whatsapp-send"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(n8nSendUrl, 'URL de Envio')}
              disabled={!n8nSendUrl}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Esta URL deve ser atualizada no código do useAtendimentoReal.ts
          </p>
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Salvar URLs
        </Button>
      </CardContent>
    </Card>
  );
}
