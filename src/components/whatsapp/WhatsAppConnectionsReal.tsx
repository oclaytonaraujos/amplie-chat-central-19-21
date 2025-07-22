
import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, WifiOff, RefreshCw, QrCode, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEvolutionApi } from '@/hooks/useEvolutionApi';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreateInstanceDialog } from './CreateInstanceDialog';

export function WhatsAppConnectionsReal() {
  const { 
    config, 
    loading, 
    conectando, 
    obterQRCode, 
    verificarStatus, 
    configurarWebhook 
  } = useEvolutionApi();
  
  const { toast } = useToast();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('desconhecido');
  const [verificandoStatus, setVerificandoStatus] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Verificar status da conexão ao carregar
  useEffect(() => {
    if (config && !loading) {
      handleVerificarStatus();
    }
  }, [config, loading]);

  const handleObterQRCode = async () => {
    try {
      const response = await obterQRCode();
      if (response.qrcode) {
        setQrCode(response.qrcode);
        setStatus('aguardando-conexao');
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível obter o QR Code",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao obter QR Code:', error);
    }
  };

  const handleVerificarStatus = async () => {
    try {
      setVerificandoStatus(true);
      const response = await verificarStatus();
      
      if (response.value) {
        setStatus(response.status || 'conectado');
        if (response.status === 'CONNECTED') {
          setQrCode(null); // Limpar QR Code se conectado
        }
      } else {
        setStatus('desconectado');
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      setStatus('erro');
    } finally {
      setVerificandoStatus(false);
    }
  };

  const handleConfigurarWebhook = async () => {
    const sucesso = await configurarWebhook();
    if (sucesso) {
      toast({
        title: "Sucesso",
        description: "Webhook configurado com sucesso!",
      });
    }
  };

  const handleInstanceCreated = () => {
    // Recarregar configurações e verificar status
    window.location.reload();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED':
      case 'conectado':
        return 'bg-green-100 text-green-800';
      case 'aguardando-conexao':
        return 'bg-yellow-100 text-yellow-800';
      case 'desconectado':
      case 'DISCONNECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONNECTED':
      case 'conectado':
        return 'Conectado';
      case 'aguardando-conexao':
        return 'Aguardando Conexão';
      case 'desconectado':
      case 'DISCONNECTED':
        return 'Desconectado';
      case 'erro':
        return 'Erro';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONNECTED':
      case 'conectado':
        return <Wifi className="w-4 h-4" />;
      case 'aguardando-conexao':
        return <QrCode className="w-4 h-4" />;
      default:
        return <WifiOff className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Carregando configurações...</span>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Conexões WhatsApp</h2>
            <p className="text-gray-600">Crie e gerencie suas conexões com o WhatsApp via Evolution API</p>
          </div>
        </div>

        <Alert>
          <Settings className="h-4 w-4" />
          <AlertDescription>
            Nenhuma configuração Evolution API encontrada. Crie sua primeira instância para começar.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="text-center py-12">
            <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Primeira Conexão WhatsApp
            </h3>
            <p className="text-gray-600 mb-6">
              Crie sua primeira instância WhatsApp através do AmplieChat para começar a atender seus clientes
            </p>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Instância
            </Button>
          </CardContent>
        </Card>

        <CreateInstanceDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onInstanceCreated={handleInstanceCreated}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Conexões WhatsApp</h2>
          <p className="text-gray-600">Gerencie suas conexões com o WhatsApp via Evolution API</p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          variant="outline"
          className="border-green-600 text-green-600 hover:bg-green-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Instância
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span>Instância: {config.instanceName}</span>
            </div>
            <Badge className={getStatusColor(status)}>
              {getStatusIcon(status)}
              <span className="ml-1">{getStatusText(status)}</span>
            </Badge>
          </CardTitle>
          <CardDescription>
            Status da sua conexão WhatsApp
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button
              onClick={handleVerificarStatus}
              disabled={verificandoStatus}
              variant="outline"
            >
              {verificandoStatus ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Verificar Status
            </Button>

            {(status === 'desconectado' || status === 'DISCONNECTED') && (
              <Button
                onClick={handleObterQRCode}
                disabled={conectando}
              >
                {conectando ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <QrCode className="w-4 h-4 mr-2" />
                )}
                Conectar WhatsApp
              </Button>
            )}

            <Button
              onClick={handleConfigurarWebhook}
              variant="outline"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurar Webhook
            </Button>
          </div>

          {qrCode && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-2">Escaneie o QR Code com seu WhatsApp:</h3>
              <div className="flex justify-center">
                <img 
                  src={qrCode} 
                  alt="QR Code para conectar WhatsApp" 
                  className="max-w-xs max-h-64"
                />
              </div>
              <p className="text-sm text-gray-600 text-center mt-2">
                1. Abra o WhatsApp no seu telefone<br/>
                2. Vá em Configurações → Aparelhos conectados<br/>
                3. Escaneie este QR Code
              </p>
            </div>
          )}

          {config.webhookUrl && (
            <div className="border rounded-lg p-4 bg-green-50">
              <h3 className="font-medium text-green-800 mb-1">Webhook Configurado</h3>
              <p className="text-sm text-green-600">
                URL: {config.webhookUrl}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateInstanceDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onInstanceCreated={handleInstanceCreated}
      />
    </div>
  );
}
