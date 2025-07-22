
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UseRealTimeUpdatesProps {
  table: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  filter?: string;
}

export function useRealTimeUpdates({
  table,
  onInsert,
  onUpdate,
  onDelete,
  filter
}: UseRealTimeUpdatesProps) {
  const { user } = useAuth();

  const setupRealtimeSubscription = useCallback(() => {
    if (!user) return null;

    const channel = supabase
      .channel(`realtime_${table}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: table,
          filter: filter
        },
        (payload) => {
          console.log(`Nova inserção em ${table}:`, payload);
          onInsert?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: table,
          filter: filter
        },
        (payload) => {
          console.log(`Atualização em ${table}:`, payload);
          onUpdate?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: table,
          filter: filter
        },
        (payload) => {
          console.log(`Exclusão em ${table}:`, payload);
          onDelete?.(payload);
        }
      )
      .subscribe();

    return channel;
  }, [user, table, onInsert, onUpdate, onDelete, filter]);

  useEffect(() => {
    const channel = setupRealtimeSubscription();
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [setupRealtimeSubscription]);
}
