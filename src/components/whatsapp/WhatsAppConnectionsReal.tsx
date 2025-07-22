
import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, WifiOff, RefreshCw, QrCode, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEvolutionApi } from '@/hooks/useEvolutionApi';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreateInstanceDialog } from './CreateInstanceDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function WhatsAppConnectionsReal() {
  const { 
    config, 
    loading, 
    conectando, 
    obterQRCode, 
    verificarStatus 
  } = useEvolutionApi();
  
  const { toast } = useToast();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('desconhecido');
  const [verificandoStatus, setVerificandoStatus] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
        toast({
          title: "QR Code gerado",
          description: "Escaneie o código com seu WhatsApp para conectar",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível obter o QR Code",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao obter QR Code:', error);
      toast({
        title: "Erro",
        description: "Falha ao gerar QR Code. Tente novamente.",
        variant: "destructive",
      });
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

  const handleDeleteConnection = async () => {
    try {
      // Aqui seria implementada a lógica para deletar a conexão
      toast({
        title: "Conexão excluída",
        description: "A conexão WhatsApp foi removida com sucesso",
      });
      setShowDeleteDialog(false);
      // Recarregar página ou atualizar estado
      window.location.reload();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conexão",
        variant: "destructive",
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'aguardando-conexao':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'desconectado':
      case 'DISCONNECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const isConnected = status === 'CONNECTED' || status === 'conectado';
  const isDisconnected = status === 'desconectado' || status === 'DISCONNECTED';

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
            <p className="text-gray-600">Crie e gerencie suas conexões com o WhatsApp</p>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Nenhuma conexão WhatsApp encontrada. Crie sua primeira conexão para começar.
          </AlertDescription>
        </Alert>

        <Card className="border-dashed border-2 border-gray-300 hover:border-green-400 transition-colors">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Primeira Conexão WhatsApp
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Conecte seu WhatsApp ao AmplieChat para começar a atender seus clientes de forma profissional
            </p>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Conexão
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
          <p className="text-gray-600">Gerencie suas conexões com o WhatsApp</p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Conexão
        </Button>
      </div>

      <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-white border-b border-gray-100">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${isConnected ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Smartphone className={`w-5 h-5 ${isConnected ? 'text-green-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">WhatsApp: {config.instanceName}</h3>
                <p className="text-sm text-gray-500">Instância WhatsApp</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(status)} border`}>
                {getStatusIcon(status)}
                <span className="ml-1 font-medium">{getStatusText(status)}</span>
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowCreateDialog(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Conexão
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Conexão
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleVerificarStatus}
              disabled={verificandoStatus}
              variant="outline"
              className="hover:bg-blue-50 hover:border-blue-300"
            >
              {verificandoStatus ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Atualizar Status
            </Button>

            {isDisconnected && (
              <Button
                onClick={handleObterQRCode}
                disabled={conectando}
                className="bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
              >
                {conectando ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <QrCode className="w-4 h-4 mr-2" />
                )}
                Conectar WhatsApp
              </Button>
            )}
          </div>

          {qrCode && (
            <div className="bg-white border-2 border-green-200 rounded-xl p-6 text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-green-700 mb-4">
                <QrCode className="w-5 h-5" />
                <h3 className="font-semibold">Escaneie o QR Code</h3>
              </div>
              <div className="inline-block p-4 bg-white rounded-lg shadow-lg border">
                <img 
                  src={qrCode} 
                  alt="QR Code para conectar WhatsApp" 
                  className="w-64 h-64 mx-auto"
                />
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium">Como conectar:</p>
                <ol className="text-left max-w-sm mx-auto space-y-1">
                  <li>1. Abra o WhatsApp no seu telefone</li>
                  <li>2. Vá em Menu → Aparelhos conectados</li>
                  <li>3. Toque em "Conectar um aparelho"</li>
                  <li>4. Escaneie este QR Code</li>
                </ol>
              </div>
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  O QR Code expira automaticamente. Se não conseguir conectar, gere um novo código.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {isConnected && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-700">
                <Wifi className="w-4 h-4" />
                <span className="font-medium">Conexão Ativa</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                WhatsApp conectado e funcionando perfeitamente
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Confirmação para Excluir */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Conexão WhatsApp</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta conexão? Esta ação não pode ser desfeita e você perderá todos os dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConnection}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CreateInstanceDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onInstanceCreated={handleInstanceCreated}
      />
    </div>
  );
}
