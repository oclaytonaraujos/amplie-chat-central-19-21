
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ConversaInterna {
  id: string;
  contato_id?: string;
  agente_id?: string;
  status: string;
  canal: string;
  prioridade: string;
  setor?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  empresa_id: string;
  profiles?: {
    id: string;
    nome: string;
    avatar_url?: string;
    status: string;
  };
}

interface MensagemInterna {
  id: string;
  conversa_id: string;
  remetente_tipo: string;
  remetente_id?: string;
  conteudo: string;
  tipo_mensagem: string;
  metadata?: any;
  lida: boolean;
  created_at: string;
}

export function useChatInterno() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversasInternas, setConversasInternas] = useState<ConversaInterna[]>([]);
  const [mensagensInternas, setMensagensInternas] = useState<{ [conversaId: string]: MensagemInterna[] }>({});
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar usuários da empresa
  const loadUsuarios = async () => {
    if (!user) return;
    
    try {
      // Primeiro, obter a empresa_id do usuário atual
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', user.id)
        .single();

      if (!currentProfile?.empresa_id) {
        console.error('Usuário não está associado a uma empresa');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, avatar_url, status, setor')
        .eq('empresa_id', currentProfile.empresa_id)
        .neq('id', user.id); // Excluir o próprio usuário

      if (error) {
        console.error('Erro ao carregar usuários:', error);
        return;
      }

      setUsuarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  // Carregar conversas internas
  const loadConversasInternas = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversas')
        .select(`
          *,
          profiles(id, nome, avatar_url, status)
        `)
        .eq('canal', 'chat-interno')
        .or(`agente_id.eq.${user.id},contato_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar conversas internas:', error);
        toast({
          title: "Erro ao carregar conversas",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setConversasInternas(data || []);
    } catch (error) {
      console.error('Erro ao carregar conversas internas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar mensagens de uma conversa interna
  const loadMensagensInternas = async (conversaId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('mensagens')
        .select('*')
        .eq('conversa_id', conversaId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar mensagens internas:', error);
        return;
      }

      setMensagensInternas(prev => ({ ...prev, [conversaId]: data || [] }));
    } catch (error) {
      console.error('Erro ao carregar mensagens internas:', error);
    }
  };

  // Criar nova conversa interna
  const criarConversaInterna = async (destinatarioId: string) => {
    if (!user) return null;
    
    try {
      // Verificar se já existe uma conversa entre os usuários
      const { data: conversaExistente, error: errorBusca } = await supabase
        .from('conversas')
        .select('id')
        .eq('canal', 'chat-interno')
        .or(`and(agente_id.eq.${user.id},contato_id.eq.${destinatarioId}),and(agente_id.eq.${destinatarioId},contato_id.eq.${user.id})`)
        .single();

      if (conversaExistente && !errorBusca) {
        return conversaExistente;
      }

      // Buscar empresa_id do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', user.id)
        .single();

      const { data, error } = await supabase
        .from('conversas')
        .insert({
          agente_id: user.id,
          contato_id: destinatarioId,
          status: 'ativo',
          canal: 'chat-interno',
          prioridade: 'normal',
          empresa_id: profile?.empresa_id
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar conversa interna:', error);
        toast({
          title: "Erro ao criar conversa",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      await loadConversasInternas();
      return data;
    } catch (error) {
      console.error('Erro ao criar conversa interna:', error);
      return null;
    }
  };

  // Enviar mensagem interna
  const enviarMensagemInterna = async (conversaId: string, conteudo: string) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('mensagens')
        .insert({
          conversa_id: conversaId,
          remetente_tipo: 'agente',
          remetente_id: user.id,
          conteudo,
          tipo_mensagem: 'texto',
          lida: false
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao enviar mensagem interna:', error);
        toast({
          title: "Erro ao enviar mensagem",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      // Atualizar updated_at da conversa
      await supabase
        .from('conversas')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversaId);

      return data;
    } catch (error) {
      console.error('Erro ao enviar mensagem interna:', error);
      return null;
    }
  };

  // Setup realtime subscriptions
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('chat-interno-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagens'
        },
        (payload) => {
          const novaMensagem = payload.new as MensagemInterna;
          console.log('Nova mensagem interna recebida:', novaMensagem);
          
          setMensagensInternas(prev => ({
            ...prev,
            [novaMensagem.conversa_id]: [
              ...(prev[novaMensagem.conversa_id] || []),
              novaMensagem
            ]
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  // Carregar dados iniciais
  useEffect(() => {
    if (user) {
      loadUsuarios();
      loadConversasInternas();
    }
  }, [user]);

  return {
    conversasInternas,
    mensagensInternas,
    usuarios,
    loading,
    loadConversasInternas,
    loadMensagensInternas,
    criarConversaInterna,
    enviarMensagemInterna
  };
}
