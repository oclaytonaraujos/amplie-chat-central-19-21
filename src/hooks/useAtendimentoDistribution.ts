import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface AtendimentoDistribution {
  assumirAtendimento: (conversaId: string, agenteId: string) => Promise<boolean>;
  liberarAtendimento: (conversaId: string) => Promise<boolean>;
  transferirAtendimento: (conversaId: string, deAgenteId: string, paraAgenteId: string, motivo?: string) => Promise<boolean>;
  verificarCapacidadeSetor: (setorId: string) => Promise<{ disponivel: boolean; capacidade: number; ativos: number }>;
  loading: boolean;
}

export function useAtendimentoDistribution(): AtendimentoDistribution {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const assumirAtendimento = useCallback(async (conversaId: string, agenteId: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      logger.info('Tentando assumir atendimento', {
        component: 'useAtendimentoDistribution',
        metadata: { conversaId, agenteId }
      });

      // Tentar assumir conversa usando update condicional
      const { data, error } = await supabase
        .from('conversas')
        .update({ 
          agente_id: agenteId, 
          status: 'ativo',
          updated_at: new Date().toISOString()
        })
        .eq('id', conversaId)
        .is('agente_id', null)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({
          title: "Atendimento já assumido",
          description: "Este atendimento foi assumido por outro agente",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Atendimento assumido",
        description: "Você assumiu este atendimento com sucesso",
      });

      logger.info('Atendimento assumido com sucesso', {
        component: 'useAtendimentoDistribution',
        metadata: { conversaId, agenteId }
      });

      return true;
    } catch (error) {
      logger.error('Erro ao assumir atendimento', {
        component: 'useAtendimentoDistribution',
        metadata: { conversaId, agenteId }
      }, error as Error);
      
      toast({
        title: "Erro",
        description: "Não foi possível assumir o atendimento",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const liberarAtendimento = useCallback(async (conversaId: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      logger.info('Liberando atendimento', {
        component: 'useAtendimentoDistribution',
        metadata: { conversaId }
      });

      const { error } = await supabase
        .from('conversas')
        .update({ 
          agente_id: null, 
          status: 'aguardando',
          updated_at: new Date().toISOString()
        })
        .eq('id', conversaId);

      if (error) throw error;

      toast({
        title: "Atendimento liberado",
        description: "O atendimento foi liberado para outros agentes",
      });

      return true;
    } catch (error) {
      logger.error('Erro ao liberar atendimento', {
        component: 'useAtendimentoDistribution',
        metadata: { conversaId }
      }, error as Error);
      
      toast({
        title: "Erro",
        description: "Não foi possível liberar o atendimento",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const transferirAtendimento = useCallback(async (
    conversaId: string, 
    deAgenteId: string, 
    paraAgenteId: string, 
    motivo?: string
  ): Promise<boolean> => {
    setLoading(true);
    
    try {
      logger.info('Transferindo atendimento', {
        component: 'useAtendimentoDistribution',
        metadata: { conversaId, deAgenteId, paraAgenteId, motivo }
      });

      // Verificar se o agente de destino pode receber mais atendimentos
      const { data: perfil } = await supabase
        .from('profiles')
        .select('setor')
        .eq('id', paraAgenteId)
        .single();

      if (perfil?.setor) {
        const capacidade = await verificarCapacidadeSetor(perfil.setor);
        if (!capacidade.disponivel) {
          toast({
            title: "Setor lotado",
            description: "O setor de destino atingiu sua capacidade máxima",
            variant: "destructive",
          });
          return false;
        }
      }

      // Atualizar conversa e criar registro de transferência
      const { error: conversaError } = await supabase
        .from('conversas')
        .update({ 
          agente_id: paraAgenteId,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversaId);

      if (conversaError) throw conversaError;

      // Registrar a transferência
      const { error: transferError } = await supabase
        .from('transferencias')
        .insert({
          conversa_id: conversaId,
          de_agente_id: deAgenteId,
          para_agente_id: paraAgenteId,
          motivo: motivo || 'Transferência manual',
          status: 'concluida'
        });

      if (transferError) throw transferError;

      toast({
        title: "Atendimento transferido",
        description: "O atendimento foi transferido com sucesso",
      });

      return true;
    } catch (error) {
      logger.error('Erro ao transferir atendimento', {
        component: 'useAtendimentoDistribution',
        metadata: { conversaId, deAgenteId, paraAgenteId }
      }, error as Error);
      
      toast({
        title: "Erro",
        description: "Não foi possível transferir o atendimento",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const verificarCapacidadeSetor = useCallback(async (setorId: string) => {
    try {
      const { data, error } = await supabase
        .from('setores')
        .select('capacidade_maxima, atendimentos_ativos')
        .eq('id', setorId)
        .single();

      if (error) throw error;

      const capacidade = data?.capacidade_maxima || 10;
      const ativos = data?.atendimentos_ativos || 0;
      const disponivel = ativos < capacidade;

      return { disponivel, capacidade, ativos };
    } catch (error) {
      logger.error('Erro ao verificar capacidade do setor', {
        component: 'useAtendimentoDistribution',
        metadata: { setorId }
      }, error as Error);
      
      return { disponivel: true, capacidade: 10, ativos: 0 };
    }
  }, []);

  return {
    assumirAtendimento,
    liberarAtendimento,
    transferirAtendimento,
    verificarCapacidadeSetor,
    loading
  };
}