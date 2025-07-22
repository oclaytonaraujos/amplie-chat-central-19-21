
import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, Phone, MoreVertical, Image, FileText, X, ArrowLeft, UserX, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAtendimentoReal } from '@/hooks/useAtendimentoReal';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatWhatsAppRealProps {
  conversaId: string;
  nomeCliente: string;
  telefoneCliente: string;
  onReturnToList?: () => void;
  onSairConversa?: () => void;
  onTransferir?: () => void;
  onFinalizar?: () => void;
}

interface Mensagem {
  id: string;
  conteudo: string;
  created_at: string | null;
  remetente_tipo: string;
  remetente_nome: string | null;
  tipo_mensagem?: string;
  metadata?: any;
}

export function ChatWhatsAppReal({ 
  conversaId, 
  nomeCliente, 
  telefoneCliente,
  onReturnToList,
  onSairConversa,
  onTransferir,
  onFinalizar
}: ChatWhatsAppRealProps) {
  const [novaMensagem, setNovaMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [anexoSelecionado, setAnexoSelecionado] = useState<File | null>(null);
  const [legendaImagem, setLegendaImagem] = useState('');
  const [mostrarPreviewAnexo, setMostrarPreviewAnexo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const { 
    mensagensConversa, 
    loadMensagensConversa, 
    enviarMensagem,
    enviarMensagemComAnexo,
    atualizarStatusConversa 
  } = useAtendimentoReal();

  const mensagens = mensagensConversa[conversaId] || [];

  useEffect(() => {
    if (conversaId) {
      loadMensagensConversa(conversaId);
      atualizarStatusConversa(conversaId, 'em-atendimento');
    }
  }, [conversaId]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!novaMensagem.trim() && !anexoSelecionado) || enviando) return;

    setEnviando(true);
    
    try {
      let sucesso = false;

      if (anexoSelecionado) {
        // Enviar mensagem com anexo
        sucesso = await enviarMensagemComAnexo(
          conversaId, 
          telefoneCliente,
          anexoSelecionado, 
          novaMensagem.trim() || legendaImagem
        );
      } else {
        // Enviar mensagem de texto
        sucesso = await enviarMensagem(conversaId, telefoneCliente, novaMensagem.trim());
      }
      
      if (sucesso) {
        setNovaMensagem('');
        setLegendaImagem('');
        setAnexoSelecionado(null);
        setMostrarPreviewAnexo(false);
        toast({
          title: "Mensagem enviada",
          description: "Mensagem enviada com sucesso!",
        });
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  };

  const handleSelecionarArquivo = (tipo: 'image' | 'document') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = tipo === 'image' ? 'image/*' : '.pdf,.doc,.docx,.txt,.xlsx,.xls';
      fileInputRef.current.click();
    }
  };

  const handleArquivoSelecionado = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAnexoSelecionado(file);
      setMostrarPreviewAnexo(true);
      if (file.type.startsWith('image/')) {
        setLegendaImagem('');
      }
    }
  };

  const removerAnexo = () => {
    setAnexoSelecionado(null);
    setLegendaImagem('');
    setMostrarPreviewAnexo(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatarHorario = (dataString: string | null) => {
    if (!dataString) return '';
    return new Date(dataString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarTamanhoArquivo = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderMensagem = (mensagem: Mensagem) => {
    const isAgente = mensagem.remetente_tipo === 'agente';
    const hasAttachment = mensagem.metadata?.attachment;

    return (
      <div
        key={mensagem.id}
        className={`flex ${isAgente ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isAgente
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-900'
          }`}
        >
          {hasAttachment && (
            <div className="mb-2">
              {hasAttachment.type === 'image' ? (
                <img 
                  src={hasAttachment.url} 
                  alt="Imagem anexada"
                  className="max-w-full h-auto rounded"
                />
              ) : (
                <div className="flex items-center space-x-2 p-2 bg-black bg-opacity-10 rounded">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">{hasAttachment.fileName}</span>
                </div>
              )}
            </div>
          )}
          
          {mensagem.conteudo && (
            <p className="text-sm">{mensagem.conteudo}</p>
          )}
          
          <div className="flex items-center justify-between mt-1">
            <span className={`text-xs ${
              isAgente ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {mensagem.remetente_nome}
            </span>
            <span className={`text-xs ${
              isAgente ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {formatarHorario(mensagem.created_at)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header do Chat */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          {isMobile && onReturnToList && (
            <Button variant="ghost" size="sm" onClick={onReturnToList}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {nomeCliente.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{nomeCliente}</h3>
            <p className="text-sm text-gray-500">{telefoneCliente}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="w-4 h-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onTransferir && (
                <DropdownMenuItem onClick={onTransferir}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Transferir
                </DropdownMenuItem>
              )}
              {onSairConversa && (
                <DropdownMenuItem onClick={onSairConversa}>
                  <UserX className="w-4 h-4 mr-2" />
                  Sair da conversa
                </DropdownMenuItem>
              )}
              {onFinalizar && (
                <DropdownMenuItem onClick={onFinalizar}>
                  <X className="w-4 h-4 mr-2" />
                  Finalizar atendimento
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Área de Mensagens */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {mensagens.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Nenhuma mensagem ainda.</p>
              <p className="text-xs mt-1">Envie uma mensagem para iniciar a conversa.</p>
            </div>
          ) : (
            mensagens.map(renderMensagem)
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Preview do Anexo */}
      {mostrarPreviewAnexo && anexoSelecionado && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Anexo selecionado:</span>
            <Button variant="ghost" size="sm" onClick={removerAnexo}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
            {anexoSelecionado.type.startsWith('image/') ? (
              <div className="flex items-center space-x-3">
                <Image className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">{anexoSelecionado.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatarTamanhoArquivo(anexoSelecionado.size)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">{anexoSelecionado.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatarTamanhoArquivo(anexoSelecionado.size)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {anexoSelecionado.type.startsWith('image/') && (
            <div className="mt-2">
              <Input
                placeholder="Adicionar legenda (opcional)"
                value={legendaImagem}
                onChange={(e) => setLegendaImagem(e.target.value)}
                className="text-sm"
              />
            </div>
          )}
        </div>
      )}

      {/* Área de Digitação */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleEnviarMensagem} className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex-shrink-0"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleSelecionarArquivo('image')}>
                <Image className="w-4 h-4 mr-2" />
                Enviar Imagem
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSelecionarArquivo('document')}>
                <FileText className="w-4 h-4 mr-2" />
                Enviar Documento
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex-1 relative">
            <Input
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              placeholder={anexoSelecionado ? "Mensagem opcional..." : "Digite sua mensagem..."}
              disabled={enviando}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            type="submit"
            disabled={(!novaMensagem.trim() && !anexoSelecionado) || enviando}
            className="flex-shrink-0 bg-green-600 hover:bg-green-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleArquivoSelecionado}
        />
      </div>
    </div>
  );
}
