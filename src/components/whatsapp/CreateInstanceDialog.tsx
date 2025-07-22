import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { QrCode, Loader2, CheckCircle, AlertCircle, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useEvolutionAPIComplete } from '@/hooks/useEvolutionAPIComplete';

interface CreateInstanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInstanceCreated: () => void;
}

interface InstanceForm {
  instanceName: string;
  description: string;
  number: string;
}

interface CreationStep {
  id: 'form' | 'creating' | 'qrcode' | 'success';
  title: string;
  description: string;
}

const CREATION_STEPS: CreationStep[] = [
  {
    id: 'form',
    title: 'Configurar Instância',
    description: 'Preencha os dados da sua instância WhatsApp'
  },
  {
    id: 'creating',
    title: 'Criando Instância',
    description: 'Criando instância no Evolution API...'
  },
  {
    id: 'qrcode',
    title: 'Conectar WhatsApp',
    description: 'Escaneie o QR Code com seu WhatsApp'
  },
  {
    id: 'success',
    title: 'Sucesso!',
    description: 'Instância criada e conectada com sucesso'
  }
];

export function CreateInstanceDialog({ open, onOpenChange, onInstanceCreated }: CreateInstanceDialogProps) {
  const [currentStep, setCurrentStep] = useState<CreationStep['id']>('form');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [formData, setFormData] = useState<InstanceForm>({
    instanceName: '',
    description: '',
    number: ''
  });
  
  const { toast } = useToast();
  const { 
    createInstance, 
    connectInstance,
    isServiceAvailable,
    loading: apiLoading,
    error: apiError
  } = useEvolutionAPIComplete();

  const resetDialog = () => {
    setCurrentStep('form');
    setQrCode(null);
    setLocalError(null);
    setFormData({
      instanceName: '',
      description: '',
      number: ''
    });
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  const saveConfigToDatabase = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile?.empresa_id) {
        throw new Error('Empresa não encontrada');
      }

      const { error } = await supabase
        .from('evolution_api_config')
        .insert({
          empresa_id: profile.empresa_id,
          instance_name: formData.instanceName,
          webhook_url: `${window.location.origin}/api/webhooks/evolution/${formData.instanceName}`,
          webhook_events: [
            'MESSAGES_UPSERT', 
            'MESSAGE_STATUS_UPDATE',
            'CONNECTION_UPDATE', 
            'QRCODE_UPDATED',
            'APPLICATION_STARTUP'
          ],
          ativo: true,
          numero: formData.number,
          descricao: formData.description
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    setLocalError(null);

    try {
      if (!isServiceAvailable) {
        throw new Error('Serviço Evolution API não está disponível. Configure primeiro no painel administrativo.');
      }

      // Etapa 1: Criar instância usando o novo hook
      setCurrentStep('creating');
      const instanceResult = await createInstance({
        instanceName: formData.instanceName,
        number: formData.number,
        webhook: `${window.location.origin}/api/webhooks/evolution/${formData.instanceName}`,
        events: [
          'MESSAGES_UPSERT', 
          'MESSAGE_STATUS_UPDATE',
          'CONNECTION_UPDATE', 
          'QRCODE_UPDATED',
          'APPLICATION_STARTUP'
        ]
      });

      if (!instanceResult) {
        throw new Error('Falha ao criar instância');
      }

      // Etapa 2: Salvar configuração no banco
      await saveConfigToDatabase();

      // Etapa 3: Obter QR Code usando o hook
      setCurrentStep('qrcode');
      const qrCodeResult = await connectInstance(formData.instanceName);
      
      if (qrCodeResult?.qrcode || qrCodeResult?.base64) {
        setQrCode(qrCodeResult.qrcode || qrCodeResult.base64);
        
        // Simular verificação de conexão (em produção, isso seria um webhook)
        setTimeout(() => {
          setCurrentStep('success');
          setTimeout(() => {
            handleClose();
            onInstanceCreated();
            toast({
              title: "Sucesso!",
              description: "Instância WhatsApp criada e conectada com sucesso",
            });
          }, 2000);
        }, 10000); // 10 segundos para demonstração
      } else {
        throw new Error('QR Code não foi gerado');
      }

    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Erro desconhecido');
      setCurrentStep('form');
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : 'Erro ao criar instância',
        variant: "destructive",
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const currentStepData = CREATION_STEPS.find(step => step.id === currentStep);
  const isLoading = localLoading || apiLoading;
  const displayError = localError || apiError;

  const renderStepContent = () => {
    switch (currentStep) {
      case 'form':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="instanceName">Nome da Instância</Label>
              <Input
                id="instanceName"
                value={formData.instanceName}
                onChange={(e) => setFormData(prev => ({ ...prev, instanceName: e.target.value }))}
                placeholder="minha-empresa-whatsapp"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use apenas letras, números e hifens
              </p>
            </div>

            <div>
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição da instância WhatsApp"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="number">Número do WhatsApp (opcional)</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                placeholder="5511999999999 (apenas números)"
                type="tel"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Número do WhatsApp que será vinculado (opcional)
              </p>
            </div>

            {!isServiceAvailable && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Configuração global Evolution API não encontrada. Configure primeiro no painel administrativo.
                </AlertDescription>
              </Alert>
            )}

            {displayError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}
          </form>
        );

      case 'creating':
        return (
          <div className="text-center py-8">
            <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg">Criando sua instância WhatsApp...</p>
            <p className="text-sm text-muted-foreground">Isso pode levar alguns momentos</p>
          </div>
        );

      case 'qrcode':
        return (
          <div className="text-center space-y-4">
            {qrCode ? (
              <>
                <div className="bg-white p-4 rounded-lg border inline-block">
                  <img 
                    src={qrCode} 
                    alt="QR Code WhatsApp" 
                    className="w-64 h-64 mx-auto"
                  />
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Como conectar:</p>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    <li>1. Abra o WhatsApp no seu telefone</li>
                    <li>2. Vá em Menu &gt; Aparelhos conectados</li>
                    <li>3. Toque em "Conectar um aparelho"</li>
                    <li>4. Escaneie o QR Code acima</li>
                  </ol>
                </div>
                <Alert>
                  <QrCode className="h-4 w-4" />
                  <AlertDescription>
                    Aguardando conexão do WhatsApp... O QR Code expira em 20 segundos.
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <div>
                <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-primary" />
                <p>Gerando QR Code...</p>
              </div>
            )}
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-semibold mb-2">Conexão estabelecida!</h3>
            <p className="text-muted-foreground">
              Sua instância WhatsApp foi criada e conectada com sucesso.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            {currentStepData?.title}
          </DialogTitle>
          <DialogDescription>
            {currentStepData?.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {renderStepContent()}
        </div>

        {currentStep === 'form' && (
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmit}
              disabled={isLoading || !formData.instanceName || !isServiceAvailable}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Instância'
              )}
            </Button>
          </DialogFooter>
        )}

        {currentStep === 'success' && (
          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              Concluir
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}